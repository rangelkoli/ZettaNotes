use supabase_auth::models::AuthClient;

fn get_auth_client() -> AuthClient {
    let auth_client: AuthClient = AuthClient::new_from_env();
    auth_client
}

#[tauri::command]
pub async fn signup_emailpassword(email: &str, password: &str) -> Result<String, String> {
    let auth_client = get_auth_client();
    match auth_client
        .sign_up_with_email_and_password(email, password, None)
        .await
    {
        Ok(response) => Ok(format!("Signup successful: {:?}", response)),
        Err(e) => Err(format!("Error during signup: {}", e)),
    }
}

#[tauri::command]
pub async fn login_emailpassword(email: &str, password: &str) -> Result<String, String> {
    let auth_client = get_auth_client();
    match auth_client.login_with_email(email, password).await {
        Ok(response) => Ok(format!("Login successful: {:?}", response)),
        Err(e) => Err(format!("Error during login: {}", e)),
    }
}
