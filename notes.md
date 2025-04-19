# Changes to how locales are dynamically loaded
Problem: vite doesnt bundle the translation files into a single file.
(maybe that's not even a problem, but a better strategy....)

- made some slight adjustments to how shared/loadtranslations.ts works
- vite now picks up the tl files and bundles them

# Changes to how react modules are implemented
- changed the approach to loading react modules
- keep importmap, but now the bundles need to be loaded as script modules where needed
- use a helper that sends a module load event to the window
- in a template file, listen to the load event, then tell me module to render with renderSomeModule()
