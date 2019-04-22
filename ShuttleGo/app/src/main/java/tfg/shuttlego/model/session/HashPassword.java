package tfg.shuttlego.model.session;

import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

@SuppressWarnings("JavaDoc")
public class HashPassword {

    public HashPassword() {}

    /**
     * Generate a hash password with salt
     *
     * @param password choose the user for his account
     *
     * @return hash password
     *
     * @throws InvalidKeySpecException
     * @throws NoSuchAlgorithmException
     */
    public String generatePassword(String password) throws InvalidKeySpecException, NoSuchAlgorithmException {

        return generateStrongPasswordHash(password);
    }

    /**
     * Validate the hash password associate to account with the input password to user
     *
     * @param storedPassword the hash password in server
     * @param inputPassword input password to user
     *
     * @return true or false if the passwords match
     *
     * @throws NoSuchAlgorithmException
     * @throws InvalidKeySpecException
     */
    public boolean validatePassword (String storedPassword, String inputPassword) throws NoSuchAlgorithmException, InvalidKeySpecException {

        return validateStrongPasswordHash(inputPassword, storedPassword);
    }

    private static String generateStrongPasswordHash(String password) throws NoSuchAlgorithmException, InvalidKeySpecException {

        char[] chars = password.toCharArray();
        byte[] salt = getSalt();

        PBEKeySpec spec = new PBEKeySpec(chars, salt, 1000, 64 * 8);
        SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");

        byte[] hash = skf.generateSecret(spec).getEncoded();

        return toHex(salt) + ":" + toHex(hash);
    }

    private static byte[] getSalt() throws NoSuchAlgorithmException {

        SecureRandom sr = SecureRandom.getInstance("SHA1PRNG");
        byte[] salt = new byte[16];
        sr.nextBytes(salt);
        return salt;
    }

    private static String toHex(byte[] array) {

        BigInteger bi = new BigInteger(1, array);
        String hex = bi.toString(16);
        int paddingLength = (array.length * 2) - hex.length();

        if(paddingLength > 0) return String.format("%0"  + paddingLength + "d", 0) + hex;
        else return hex;
    }

    private static boolean validateStrongPasswordHash(String inputPassword, String storedPassword) throws NoSuchAlgorithmException, InvalidKeySpecException {

        String[] parts = storedPassword.split(":");
        byte[] salt = fromHex(parts[0]);
        byte[] hash = fromHex(parts[1]);

        PBEKeySpec spec = new PBEKeySpec(inputPassword.toCharArray(), salt, 1000, hash.length * 8);
        SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
        byte[] testHash = skf.generateSecret(spec).getEncoded();

        int diff = hash.length ^ testHash.length;

        for(int i = 0; i < hash.length && i < testHash.length; i++) diff |= hash[i] ^ testHash[i];

        return diff == 0;
    }

    private static byte[] fromHex(String hex) {

        byte[] bytes = new byte[hex.length() / 2];
        for(int i = 0; i < bytes.length ; i++) bytes[i] = (byte)Integer.parseInt(hex.substring(2 * i, 2 * i + 2), 16);

        return bytes;
    }
}
