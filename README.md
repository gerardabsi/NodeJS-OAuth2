# NodeJS-OAuth2
An OAuth2 Implementation For Node JS Based On oauth2-server npm 
## Run Project
    npm install
    gulp start
    
You can find NodeJS OAuth2.postman_collection where you can test the APIs

##File Structure:
 - OAuth: 
    - OAuthModels 
        - index: Models Setup
        - OAuthAccessToken: Access Token Model
        - OAuthRefreshToken: Refresh Token Model
        - User: User Model
    - authenticate: middle ware to check neither the user is authenticated ot not
    - index: initialize the OAuth2
    - OAuthCore: OAuth2 Functions
    - OAuthController: Add User / Sing In / Refresh Token
    - OAuthInit: OAuth Setup and configurations
    - OAuthServices: Database Services
 - Routers:
    - UserRouters
        - userRouter: User Router /user
 - RouterProviders:
    - userRouterProviders:
        - userRouterProvider: Initialize the user router
    - routerProviders: Initialize routers
 - Services:
    - messagesService : Message Provider
 - app: NodeJS entry point
 - config: Database Config
 
  