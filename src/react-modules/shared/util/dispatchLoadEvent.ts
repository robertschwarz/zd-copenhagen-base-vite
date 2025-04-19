export const dispatchLoadEvent = (moduleName: string) => {
  const event = new CustomEvent(`${moduleName}-module::load`, {
    bubbles: true,
  });

  window.dispatchEvent(event);
};
