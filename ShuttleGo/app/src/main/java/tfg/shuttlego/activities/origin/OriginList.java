package tfg.shuttlego.activities.origin;

import android.content.Intent;
import android.support.annotation.NonNull;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.view.MenuItem;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;
import java.util.ArrayList;
import java.util.HashMap;
import tfg.shuttlego.R;
import tfg.shuttlego.activities.person.admin.AdminMain;
import tfg.shuttlego.model.adapter.RecyclerViewAdapterOrigin;
import tfg.shuttlego.model.event.Event;
import tfg.shuttlego.model.event.EventDispatcher;
import tfg.shuttlego.model.session.Session;
import tfg.shuttlego.model.transfer.origin.Origin;
import tfg.shuttlego.model.transfer.person.Person;

public class OriginList extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener{

    private NavigationView navigationView;
    private LinearLayout originListLinear;
    private ProgressBar originListProgress;
    private ArrayList<Origin> listOrigins;
    private DrawerLayout originListDrawer;
    private Person user;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.origin_list);

        user = Session.getInstance(getApplicationContext()).getUser();

        inicializateView();
        setProgressBar();
        setMenuDrawer();
        setCredencials();
        throwEventGetAllOrigins();
    }

    /**
     * Inicializate the componentes of this view
     */
    private void inicializateView() {

        originListLinear = findViewById(R.id.origin_list_linear);
        originListProgress = findViewById(R.id.origin_list_progress);
        originListDrawer = findViewById(R.id.origin_list_drawer);
    }

    /**
     * Show the progress bar component visible and put invisble the rest of the view
     */
    private void setProgressBar() {

        originListProgress.setVisibility(View.VISIBLE);
        originListLinear.setVisibility(View.GONE);
    }

    /**
     * Show the view visible and put invisble progress bar component
     */
    private void removeProgressBar() {

        originListProgress.setVisibility(View.GONE);
        originListLinear.setVisibility(View.VISIBLE);
    }

    /**
     * Inicializate the components to put the menu in the view
     */
    private void setMenuDrawer() {

        navigationView = findViewById(R.id.origin_list_nav);
        navigationView.setNavigationItemSelectedListener(this);
        Toolbar toolbar = findViewById(R.id.origin_list_toolbar);
        setSupportActionBar(toolbar);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, originListDrawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        originListDrawer.addDrawerListener(toggle);
        toggle.syncState();
    }

    /**
     * Put the personal data about the current user
     */
    private void setCredencials() {

        View hView =  navigationView.getHeaderView(0);
        TextView nav_name_text = hView.findViewById(R.id.menu_nav_header_name);
        TextView nav_email_text = hView.findViewById(R.id.menu_nav_header_email);
        nav_name_text.setText(user.getName() + " " + user.getSurname());
        nav_email_text.setText(user.getEmail());
    }

    /**
     * Throw the event that allow to get a list of all origins in the server
     *
     */
    private void throwEventGetAllOrigins() {

        EventDispatcher.getInstance(getApplicationContext())
        .dispatchEvent(Event.GETORIGINS, null)
        .addOnCompleteListener(task -> {

            if (!task.isSuccessful() || task.getResult() == null) {

                throwToast(R.string.errConexion);
                startActivity(new Intent(OriginList.this, AdminMain.class));
            }
            else if (task.getResult().containsKey("error")) {
                throwToast(R.string.errServer);
                startActivity(new Intent(OriginList.this, AdminMain.class));
            }
            else {

                HashMap<?, ?> result = task.getResult();
                ArrayList<HashMap<?, ?>> list = (ArrayList<HashMap<?, ?>>) result.get("origins");
                listOrigins = new ArrayList<>();

                assert list != null;
                for (int i = 0; i < list.size(); ++i) {
                    Origin origin = new Origin();
                    origin.setId((String) list.get(i).get("id"));
                    origin.setName((String) list.get(i).get("name"));
                    listOrigins.add(origin);
                }

                createListView();
                removeProgressBar();
            }
        });
    }

    /**
     * Inicializate the componentes and the adapter to put the list of origins
     */
    private void createListView() {

        RecyclerView recycler = findViewById(R.id.origin_list_recycler);
        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(getApplicationContext());
        recycler.setLayoutManager(layoutManager);
        RecyclerView.Adapter<RecyclerViewAdapterOrigin.OriginViewHolder> adapter = new RecyclerViewAdapterOrigin(listOrigins);
        recycler.setAdapter(adapter);
    }

    private void throwToast(int msg) { Toast.makeText(getApplicationContext(), msg, Toast.LENGTH_SHORT).show(); }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem menuItem) {

        switch (menuItem.getItemId()) {

            case R.id.admin_drawer_home: startActivity(new Intent(OriginList.this, AdminMain.class)); break;
        }

        originListDrawer.closeDrawer(GravityCompat.START);

        return true;
    }

    @Override
    public void onBackPressed() {
        if (originListDrawer.isDrawerOpen(GravityCompat.START)) originListDrawer.closeDrawer(GravityCompat.START);
        else finish();
    }
}
