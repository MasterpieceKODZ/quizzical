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

### Refrence

#### **getChallengeText** _params :_ (none), _returns_ : string

This function is located in the challenge.ts file in the root directory, and it gets a random number from 0 to 3 and selects one of the four challenge texts in the file based on the number generated which is then written in the challenge console.

#### **initiateLoginProcess** _params :_ (none), _returns_ : void

This function is called when the user submits the login form, it validates the email address by sending a get request to the abstract-API email validation API and then it validates the password using regular expressions
if the email and password are valid the user would be allowed to login else an error message will be shown to the user

#### **loginEmailValidation** _params :_ (email : string), _returns_ : Promise<object>

This function makes a get request to the abstract-API email validation API it is and if email is valid it returns an object with an emailState prop and an optional autocorrect property which hold a suggested email if the email entered by the user is suspected to have a typo error
_possible email state values are:_

    ***VALID*** - email is valid
    ***CATCH_ALL*** - email is a catch all email address (not permitted)
    ***ROLE*** - email is a role email address (not permitted)
    ***TYPO*** - email has a typo error (not permitted), in this case the returned promise object would have two props emailState and autocorrect
    ***INVALID*** - email is invalid

#### **validatePasswordOnChange** _params :_ (none), _returns_ : none

while the user types in their password this function reviews the value entered and notify the user of the password requirments state, this function uses regular expressions to check password requirements

#### **validatePasswordOnSubmit** _params :_ (none), _returns_ : boolean

before the form is submitted to complete login this function is called to verify password requirement
