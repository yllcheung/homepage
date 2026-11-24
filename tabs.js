function setupTabs(list, orientation) {
  const tabs = Array.from(list.querySelectorAll('button[data-panel]'));
  const panels = tabs.map(tab => document.getElementById(tab.dataset.panel));

  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-orientation', orientation);
  tabs.forEach((tab, index) => {
    const panel = panels[index];
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
  });

  function show(target) {
    const match = panels.findIndex(panel => target && panel.contains(target));
    tabs.forEach((tab, index) => {
      const active = index === Math.max(match, 0);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = panels[index];
      if (!active && !panel.hidden) {
        panel.querySelectorAll('audio').forEach(audio => {
          if (!audio.paused) audio.pause();
        });
      }
      panel.hidden = !active;
    });
  }

  function select(tab) {
    const hash = '#' + tab.dataset.panel;
    if (window.location.hash !== hash) window.history.pushState(null, '', hash);
    showFromHash();
    window.scrollTo(0, 0);
  }

  list.addEventListener('click', event => {
    const tab = event.target.closest('[role="tab"]');
    if (tab) select(tab);
  });

  list.addEventListener('keydown', event => {
    const index = tabs.indexOf(event.target);
    if (index < 0) return;

    let next;
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        next = (index - 1 + tabs.length) % tabs.length;
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        next = (index + 1) % tabs.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = tabs.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    select(tabs[next]);
    tabs[next].focus();
  });

  list.hidden = false;
  return show;
}

const showSidebar = setupTabs(document.querySelector('.section-nav'), 'vertical');
const showProjects = setupTabs(document.querySelector('.project-tabs'), 'horizontal');

function showFromHash() {
  const id = window.location.hash.slice(1);
  const target = document.getElementById(id === 'about' ? 'home' : id);
  showSidebar(target);
  showProjects(target);
}

const skip = document.querySelector('.skip');
skip.hidden = false;
skip.addEventListener('click', () => document.getElementById('main').focus());

window.addEventListener('hashchange', showFromHash);
showFromHash();
