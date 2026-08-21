# Restart Command Rule

When the user asks to "restart" (without explicitly mentioning the local dev environment), they want to start the local development server using `browser-sync` at the project root.

You should execute the following command:
`export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH" && npx browser-sync start --config bs-config.js`

Important execution details:
- Run it in the project root directory.
- Use `IsDaemon: true` (or equivalent for a background/persistent process).
- Due to the literal `*` in the workspace path (`*GitHub`), you must use `BypassSandbox: true` when running this command, as the standard sandbox environment does not support paths containing glob characters.
