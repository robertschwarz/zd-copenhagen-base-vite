# Bugs
Running all 3 servers with `yarn dev` (both vite builds, zcli themes:preview) at the same time
sometimes causes vite not to load all read dependencies (524 - gateway error).

The issue is resolved by stopping the server and running `yarn dev` again

I couldn't figure out why.

# Changes to how locales are dynamically loaded
Problem: vite doesnt bundle the translation files into a single file.
(maybe that's not even a problem, but a better strategy....)

- made some slight adjustments to how shared/loadtranslations.ts works
- vite now picks up the tl files and bundles them

# Changes to how react modules are implemented
- changed the approach to loading react modules
- keep importmap, but now the bundles need to be loaded as script modules where needed
- use a helper that sends a module load event to the window
- window function definitions are handled in `global.d.ts` (base dir)
- in a template file, listen to the load event, then tell me module to render with renderSomeModule()
