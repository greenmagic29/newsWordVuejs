<template>
  <main class="login__main">
    <section class="login__section">
      <p class="login__icon">
        <span class="material-symbols-outlined"> newspaper </span>
      </p>
      <p class="login__title">OneNews</p>

      <p class="login__intro">Continue with the following</p>
      <div id="google_button" class="login__google-btn"></div>
      <div id="prompt_parent_id"></div>
      <!-- <div
        id="g_id_onload"
        data-client_id="293155402509-b0pk4d2iqb3538d26j7j7evgfd37aojd.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        
        data-nonce=""
        data-itp_support="true"
      ></div>
      data-callback="handleCredRes" 
      <div
        class="g_id_signin login__google-btn"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div> -->
      <p class="login__footer">
        <a>About</a>
      </p>
    </section>
  </main>
</template>
<script>
import jwt_decode from "jwt-decode";
export default {
  methods:{
    async  handleCredRes(res) {
      console.log("🚀 ~ file: login.html:11 ~ handleCredRes ~ res", res)
      const responsePayload = jwt_decode(res.credential);
      console.log("🚀 ~ file: login.html:12 ~ handleCredRes ~ responsePayload", responsePayload)

      const signupBody = {
        name: responsePayload.name,
        email: responsePayload.email,
        profilePic: responsePayload.picture,
        googleToken: res.credential
      };
      
      try {
        const ress = await fetch(`${this.backendPath}/signup`, {
          method: 'POST',
          
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(signupBody)
        });
        if (ress.status !== 200) {

          throw Error("incorrect goolge");
        }

        const ressBody = JSON.parse(await ress.text());
        console.log("🚀 ~ file: login.html:38 ~ handleCredRes ~ ressBody", ressBody)

        localStorage.setItem('login', ressBody.token);
        localStorage.setItem('user', JSON.stringify(ressBody.user));
        window.location.href = "/"
      }
      catch (error) {
        window.location.href = "/login.html";
      }

    }
  },
  mounted: function (){
    google.accounts.id.initialize({
   client_id:
    '293155402509-b0pk4d2iqb3538d26j7j7evgfd37aojd.apps.googleusercontent.com',
     callback: this.handleCredRes,
     
  });
  google.accounts.id.renderButton(
    document.getElementById("google_button"),
    {
      theme: 'outline',
      size: 'large',
      click_listener: this.handleCredRes
    }
   
    )
  google.accounts.id.prompt()
  }
}
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fugaz+One&family=Nunito&display=swap');
*,
*::after,
*::before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
img {
	display: block;
	max-width: 100%;
	height: auto;
}

:root {
  --FF: "Nunito", sans-serif;
  --FS: clamp(1rem, 2.2vh, 1.5rem);
}

.login__main {

  display: flex;
  justify-content: center;
  
}

.login__section {
  margin: 1rem;
  border: 1px solid gray;
  border-radius: 15px;

  padding: 1rem;
  width: 100%;
  max-width: 600px;
  background-color: var(--color-background-soft);

  display: flex;
  justify-content: center;
  flex-direction: column;
}
.login__title {
  font-size: 3rem;
  text-align:center;
}
.login__icon {
  text-align: center;
}
.login__icon .material-symbols-outlined {
  font-size: 5rem;
}
.login__intro {
  text-align: center;
  margin: 1rem 0;
}
.login__google-btn {
  margin: 0 auto;
}

.login__footer {
  margin: 1rem 0;
/*   min-height: calc(100vh - 30em); */
  text-align: center;
}
</style>

