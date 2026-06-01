import {useLocation} from 'preact-iso'
import {Field, Form, useForm} from '@formisch/preact';
import type {SubmitHandler} from '@formisch/preact';
import LogoIcon from "../assets/images/venture-pastoralia-icon.svg"
import {IconGoogle} from "../components/icons";
import {LoginSchema} from "@venture-pastoralia/shared";
import {useMutation, useQuery} from "@tanstack/preact-query";
import {tryLogin} from "../data/auth";

export function Login() {
  const {route} = useLocation()

  const authLogin = useMutation({
    mutationFn: tryLogin,
    onSuccess: () => {
      route('/dashboard')
    },
    onError: err => {
      console.log(err)
    }
  })

  const loginForm = useForm({
    schema: LoginSchema,
    initialInput: {
      email: '',
      password: ''
    },
    revalidate: "change"
  })

  const submitForm: SubmitHandler<typeof LoginSchema> = async (values) => {
    authLogin.mutate({
      email: values.email,
      password: values.password
    })
  }

  return (
    <div class="auth">
      <aside class="auth__panel">
        <div class="auth__panel-inner">
          <div class="auth__panel-logo">
            <p class="auth__panel-logomark">
              <img src={LogoIcon} width={32} height={32} alt="Pastoralia"/>
            </p>
            <p class="auth__panel-logotext">Venture Pastoralia</p>
          </div>
          <p class="auth__panel-tagline">
            Preparing a bride<br/>fit for the King
          </p>
          <p class="auth__panel-deco" aria-hidden="true">&pi;</p>
        </div>
      </aside>

      <main class="auth__stage">
        <section class="auth__card">
          <div class="auth__intro">
            <h1 class="auth__heading">Welcome back</h1>
            <p class="auth__sub">Sign in to your account.</p>
          </div>

          <Form of={loginForm} onSubmit={submitForm}>
            <Field of={loginForm} path={["email"]}>
              {(field) => (
                <div class="auth__field">
                  <label class="auth__label" htmlFor={field.props.name}>User email</label>
                  <input
                    type="email"
                    class="auth__input"
                    {...field.props} value={field.input}
                    id={field.props.name}
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                  {field.errors.value && <p class="auth__error">{field.errors.value}</p>}
                </div>
              )}
            </Field>
            <Field of={loginForm} path={["password"]}>
              {(field) => (
                <div class="auth__field">
                  <label class="auth__label" htmlFor={field.props.name}>Password</label>
                  <input
                    type="password"
                    className="auth__input"
                    id={field.props.name}
                    {...field.props}
                    value={field.input}
                    placeholder="************"
                  />
                  {field.errors.value && <p class="auth__error">{field.errors.value}</p>}
                </div>
              )}
            </Field>
            {authLogin.isError && <p class="auth__error">{authLogin.error}</p>}
            <button class="auth__submit" type="submit" disabled={loginForm.isSubmitting.value}>
              {loginForm.isSubmitting.value && <span class="auth__spinner" aria-hidden="true"/>}
              {loginForm.isSubmitting.value ? 'Signing in…' : 'Sign in'}
            </button>
          </Form>

          <div class="auth__divider"><span>or</span></div>

          <button class="auth__oauth-btn" type="button" disabled aria-disabled="true">
            <IconGoogle/>
            <span>Continue with Google</span>
            <span class="auth__oauth-badge">Soon</span>
          </button>

          <p class="auth__note">
            This app is for authorised people only.
            There is no self-registration — contact the administrator to request access.
          </p>
        </section>
      </main>
    </div>
  )
}
