import { SettingsForm } from '../features/settings/SettingsForm'

const Settings = () => (
  <section className="space-y-4 sm:space-y-6">
    <header className="text-center sm:text-left">
      <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-white/80 sm:mt-2 sm:text-base">
        Configure players, animations, and defaults. All inputs are validated.
      </p>
    </header>
    <SettingsForm />
  </section>
)

export default Settings
