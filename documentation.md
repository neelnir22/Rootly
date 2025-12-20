# Personal Collection

### [website reference](https://linktr.ee/linktr.ee)

## features:

- [x] login
- [x] register
- [x] forgot password(OTP)
- [x] reset password
- [x] email verify(mandatory)(OTP)
- [x] CRUD(anyone can view users but only admin edit them)
- [x] anyone can like anyone's profile
- [x] Atleast 7 social media platform
- [x] Logo 🚀
- [x] profile name
- [x] will add custom links :+1:
- [x] private or public account

## User Schema

```
{
  "firstName": "String",
  "lastName?": "String",
  "email": "String",
  "phoneNum?":"Number",
  "password":"string",
  "userName":"string",
  "instagram?":"String"
  "twitter?":"String"
  "linkedin?":"String"
  "gmail?":"String"
  "youtube?":"String"
  "tiktok?":"String"
  "snapchat?":"String"
  "links?":[String],
  "likeCount?":Number,
  "emailVerified?":"Boolean",
  "logo":"String",
  "phoneNumVerified?":"Boolean",
  "active":"Boolean"
}
```

## Like Schema

```
{

   "from":{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
   },
   "to":{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
   },
}
```

## Method / Route Name

1. **POST/users/register**

   | Body            | Type   |
   | --------------- | ------ |
   | name            | String |
   | userName?       | String |
   | phone?          | Number |
   | email           | String |
   | password        | String |
   | confirmPassword | String |

   ### response

   ```
   {
      "status":"success",

      "data":{
         "user":{
            "token",
            "userName",
            "name",
            "logo",
            "active",
         }
      }
   }
   ```

2. **POST/users/login**

   | Body           | Type   |
   | -------------- | ------ |
   | email/userName | String |
   | password       | String |

   ### Response

   ```
   {
      "status":"success",
      "data":{
         "user":{
            "token",
            "userName",
            "name",
            "links":[Strings],
            "logo"
         }
      }
   }
   ```

3. **POST/users/forgot-password**

   | Body           | Type   |
   | -------------- | ------ |
   | email/userName | String |

   ### response

   ```
   {
      "status":"success",
      "message":'A otp has been sent to the email you provided, use that otp to change password'
   }
   ```

4. **PATCH/users/reset-password**

   | Body            | Type   |
   | --------------- | ------ |
   | email/userName  | String |
   | currentPassword | String |
   | newPassword     | String |

### response

```
 {
    "status":"success",
    "message":"password has been succesfully updated,log in again"
 }
```

6. **GET/users/:userName?**
7. **PATCH/users/:userName**

   | Body       | Type     |
   | ---------- | -------- |
   | logo?      | String   |
   | userName?  | String   |
   | links?     | [String] |
   | firstName? | String   |
   | lastName?  | String   |
   | email?     | String   |
   | phoneNum?  | Number   |
   | instagram? | String   |
   | twitter?   | String   |
   | linkedin?  | String   |
   | gmail?     | String   |
   | youtube?   | String   |
   | tiktok?    | String   |
   | snapchat?  | String   |

   ### response

```
 {
    "status":"success",
    "message":"data updated successfully",
    "data":{
     "updated-data"
    }
 }
```

8. **PATCH/users/:userName/like**

   ### response

```
 {
    "status":"success",
    "message":"like count has been updated"
 }
```
