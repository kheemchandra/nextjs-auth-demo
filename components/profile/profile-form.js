import { useRef } from "react"; 

import classes from "./profile-form.module.css";

function ProfileForm(props) { 
  
  const newPasswordRef = useRef();
  const oldPasswordRef = useRef();

  async function changePasswordHandler(event) {
    event.preventDefault();

    const newPassword = newPasswordRef.current.value;
    const oldPassword = oldPasswordRef.current.value;

    // optional: password validation
    try {
      const response = await fetch("api/user/password-change", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({newPassword, oldPassword}),
      });
      const result = await response.json(); 
      if(!response.ok){
        throw new Error(result.message || 'Something went wrong!');
      }
      console.log(result.message);
    } catch(error) {
      console.log(error.message)
    }
  }

  return (
    <form onSubmit={changePasswordHandler} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPasswordRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor="old-password">Old Password</label>
        <input type="password" id="old-password" ref={oldPasswordRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
