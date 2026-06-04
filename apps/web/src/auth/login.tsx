import { useLocation } from 'preact-iso'
import { useForm } from '@tanstack/preact-form'
import LogoIcon from "../assets/images/venture-pastoralia-icon.svg"
import { IconGoogle } from "../components/icons";
import { LoginSchema } from "@venture-pastoralia/shared";
import { useMutation } from "@tanstack/preact-query";
import { tryLogin } from "../data/auth";
import { $ZodIssue } from "zod/v4/core";

type Error = $ZodIssue[] | null

const toZodError = (meta: unknown): Error => {
  const errors = meta as unknown as { isValid: boolean, errors: $ZodIssue[] }
  if (errors.isValid) {
    return null
  }
  return errors.errors
}

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

  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    onSubmit: async ({value}) => {
      authLogin.mutate(value)
    },
  })

  return (
    <div class="auth">
      <aside class="auth__panel">
        <div class="auth__panel-inner">
          <div class="auth__panel-logo">
            <p class="auth__panel-logomark">
              <img src={ LogoIcon } width={ 32 } height={ 32 } alt="Pastoralia"/>
            </p>
            <p class="auth__panel-logotext">Venture Pastoralia</p>
          </div>
          <p class="auth__panel-tagline">
            Preparing a bride<br/>fit for the King
          </p>
          <p class="auth__panel-deco" aria-hidden="true">ἑτοιμζόμαι</p>
        </div>
      </aside>

      <main class="auth__stage">
        <section class="auth__card">
          <div class="auth__intro">
            <h1 class="auth__heading">Welcome back</h1>
            <p class="auth__sub">Sign in to your account.</p>
          </div>

          <form
            onSubmit={ (e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            } }
          >
            <form.Field
              name="email"
              validators={ {onChange: LoginSchema.shape.email} }
            >
              { (field) => {
                const errors = toZodError(field.state.meta);
                return (
                  <div class="auth__field">
                    <label class="auth__label" htmlFor={ field.name }>User email</label>
                    <input
                      type="email"
                      class={ `auth__input ${errors ? 'auth__input--error' : ''}`  }
                      id={ field.name }
                      name={ field.name }
                      value={ field.state.value }
                      onBlur={ field.handleBlur }
                      onChange={ (e) => field.handleChange(e.currentTarget.value) }
                      autoComplete="email"
                      placeholder="you@example.com"
                    />
                    { errors && <p class="auth__error">{ (field.state.meta.errors[0] as $ZodIssue).message }</p> }
                  </div>
                )
              } }
            </form.Field>

            <form.Field
              name="password"
              validators={ {onChange: LoginSchema.shape.password} }
            >
              { (field) => {
                const errors = toZodError(field.state.meta);
                return (
                  <div class="auth__field">
                    <label class="auth__label" htmlFor={ field.name }>Password</label>
                    <input
                      type="password"
                      class={ `auth__input ${errors ? 'auth__input--error' : ''}`  }
                      id={ field.name }
                      name={ field.name }
                      value={ field.state.value }
                      onBlur={ field.handleBlur }
                      onInput={ (e) => field.handleChange(e.currentTarget.value) }
                      placeholder="************"
                    />
                    { errors && <p class="auth__error">{ errors[0].message }</p> }
                  </div>
                )
              } }
            </form.Field>

            { authLogin.isError && (
              <p class="auth__error">{ authLogin.error?.message }</p>
            ) }

            <form.Subscribe
              selector={ (state) => ({canSubmit: state.canSubmit, isSubmitting: state.isSubmitting}) }
            >
              { ({canSubmit, isSubmitting}) => (
                <button class="auth__submit" type="submit" disabled={ !canSubmit || isSubmitting }>
                  { isSubmitting && <span class="auth__spinner" aria-hidden="true"/> }
                  { isSubmitting ? 'Signing in…' : 'Sign in' }
                </button>
              ) }
            </form.Subscribe>
          </form>

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
