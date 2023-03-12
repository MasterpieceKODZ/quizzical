# QUIZZICAL

The quiz questions used in this app comes from [The Trivia App API](https://www.the-trivia-api.com).

In this project I hav used...

- Next.JS
- Tailwind CSS
- vercel fonts
- vercel Hosting
- PostCSS
- Redux
- Firebase
- Abstract API [email validation](https://app.abstractapi.com/api/)
- RegExp

## Refrence

#### **challenge.ts/getChallengeText()** : string

    This function is located in the challenge.ts file in the root directory, and it generates a random number from 0 to 3 and selects one of the four challenge texts in the file based on the number generated which is then written in the challenge console on the welcome page.

### myFunctions/

#### **startLogin.ts/initiateLoginProcess(router : NextRouter)** : void.

    This function is called when the user submits the login form, It first reviews the password by the minimum password requirements, if the password passes the minimum password requirement then the sign-in authentication process is initiated by calling the _loginUserAccount_ function.

_params_

- router -> this is a NextRouter object which is passed down to _loginUserAccount_, it is used to navigate user to quizroom if sign-in is successful

#### **loginUserAccount(email: string, password: string,router : NextRouter)** : void

    this function runs the firebase login auth code, it takes in the provided email and password after validation.
    The router param is used to navigate user to quizroom upon successful sign-in

#### **validateEmailAddress.ts/validateEmailInputed(email : string,action : string)** : Promise[object].

    This function makes a get request to Abstract-API email validation API, if email is valid it returns an object with emailState prop and an optional autocorrect property which holds a suggested email if the email entered by the user is suspected to have a typo error.
    The action param is used to identify the page of the email input field, (login or signup)

    possible values of emailState property of the object returned are:

    **_VALID_** - email is valid

    **_CATCH_ALL_** - email is a catch all email address (not permitted)

    **_ROLE_** - email is a role email address (not permitted)

    **_TYPO_** - email has a typo error (not permitted), in this case the returned promise object would have two props. emailState and autocorrect

    **_INVALID_** - email is invalid

#### **validateEmailAddress.ts/getEmailValidationResponse(email : string,action : string)** : Promise[boolean].

    This function is used to get the result of email validation on any email input page (login or signup), it returns a boolean promise that denotes the validity of the email provided by the user.
    The action param is used to identify the page of the email input field.

#### **validatePassword.ts/validatePasswordOnChange(e: any, action: string)** : none.

    while the user types in their password this function reviews the value entered and notifies the user of the password requirments state, this function uses regular expressions to check password requirements.

    **Params:**

- **e : any** -> an event object from the onChange listener of the email input.
- **action : string** -> an identification of the page where the function is being called from, to help select the right password requirements elements, possible values are:

        reset -> function was called from the password reset page.
        login -> function was called from the login page.
        signup -> function was called from the signup page

  this helps to reduce boilerplate code during password validation on diffrent password input pages.

#### **validatePassword.ts/validatePasswordOnSubmit(action: string)** : boolean.

    when the login form is submitted this function is called to verify password requirement before completing login,
    the action params identifies the page where the function was called.

#### **showHideLoginInfo.ts/showLoginInfo (info: string,action : string)** : void.

    this function is used to show a message to the user, the action param is used to identify the page on which the info should be shown (signup or login)

#### **showHideFormInfo.ts/hideLoginInfo(action : string)** : void.

    this function hides the info message console shown by _showLoginInfo_. the action param identifies the page on which the info console is located

#### **showHideSpinner.ts/showLoadingSpinner()** : void.

    this function shows the apps default loading spinner component.

#### **showHideSpinner.ts/hideLoadingSpinner()** : void.

    this function hides the apps default loading spinner component.

#### **forgotPassword.ts/handelForgotPassword()** : void

    this is the callback function of the login page forgot password button click event, it sends a password reset email to the user provided email address

#### **resetPassword.ts/resetUserPassword(actionCode: string,email: string,router: NextRouter,setRetryPasswordReset: any)** : void

    this function is called when the confirm button on the password reset page is clicked , the _actionCode_ parameter is passed down to the function from the reset password page, it is a temporary code generated by firebase to verify the password reset action, it is added as a URL parameter in the URL embeded in the password reset email with the name _oobCode_.

    If the _actionCode_ is still valid (it expires after a short while), then the password reset would be confirmed.

    if password is successfully resetted the user is signed in immediately and sent to the quizrooom using the provided _router_ argument.

    the _setRetryPasswordReset_ function argument is used to update the _retryReset_ state of the reset password page, and if the _retryReset_ state is true a retry button is shown and all other UI elements are hidden, the retry button navigates the user back to the login page, so they can start the **forgot password** process all over again.

#### **passwordFocus.ts/showHidePassword(e: any)** : void

    This is the click event callback function of the secondary password toggle button, it shows the password value by changing the input type from password to text when password is invisible, and it reverses the process when password is visible

#### **userSignUp.ts/checkSignUpPasswordMatch()** : void

    This is the callback function of the signup page confirm password input, it compares the value of the two password input values and gives the user a feedback based on the result of the comparison (**positive** - password are a match, **negative** - passwords do not match)
