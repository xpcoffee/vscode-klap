# klap

The core klap project. This should be a pure NodeJS library and will later be extracted. No references to VSCode or any other system.

## Project structure

```bash
core        # klap functionality; almost entirely individual pieces of functionality (that do ) that can be composed. Should have no dependencies on other modules.
toolkit     # a user-friendly interface built by composing functionality from core. This should be the only dependency for the majority of external use-cases.
```
