# Lessons Learned

## Build and Environment
- **Lesson 1: WSL/Windows Native Module Mismatch**
    - **Problem**: Running `npm install` on Windows and then executing `npm run dev` or `npm run build` in WSL (Linux) leads to errors like `Error: Cannot find module @rollup/rollup-linux-x64-gnu`. Native modules like Rollup install platform-specific binaries.
    - **Mistake**: I ran `npm install` using `run_command` (Windows) while the user was developing in WSL.
    - **Correction**: Always verify the user's execution environment. If they are in WSL, all dependency management (`npm install`) must be performed inside WSL using `wsl npm install`.
    - **Preventative Rule**: Before running any build or dependency command, check the current terminal context in the logs. If paths are `/mnt/c/...` or the prompt shows a Linux distribution, use `wsl` prefix for all commands.
