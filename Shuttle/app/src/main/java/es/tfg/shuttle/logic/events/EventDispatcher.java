package es.tfg.shuttle.logic.events;

import android.content.Context;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONObject;

public class EventDispatcher {

    private static EventDispatcher ourInstance = null;
    private RequestQueue queue = null;
    private EventDispatcher() {};

    private static final String proyectId = "shuttlebus-c7c54";
    private static final String proyectURL = "https://us-central1-"+proyectId+".cloudfunctions.net/";


    static EventDispatcher getInstance(Context ApplicationContext) {

        if(ourInstance == null){
            ourInstance = new EventDispatcher();
            ourInstance.queue = Volley.newRequestQueue(ApplicationContext);
        }

        return ourInstance;
    }


    public void dispatchEvent(Events event, JSONObject data){

        Request request = null;

        switch(event){
            case SIGNIN:

                request = new JsonObjectRequest(Request.Method.POST,proyectURL+"signin",data,

                    new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {


                    }
                }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {


                    }
                });


            break;
        }

        this.queue.add(request);
    }
}