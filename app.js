'use strict';

function initMenu() {
  const entete = document.querySelector('.site-header');
  const bouton = document.querySelector('.menu-toggle');
  const liste = document.getElementById('menu-principal');
  if (!entete || !bouton || !liste) return;

  entete.classList.add('js-menu');

  function basculer(ouvrir) {
    liste.classList.toggle('ouvert', ouvrir);
    bouton.setAttribute('aria-expanded', String(ouvrir));
  }

  bouton.addEventListener('click', function () {
    const estOuvert = bouton.getAttribute('aria-expanded') === 'true';
    basculer(!estOuvert);
  });

  
  liste.addEventListener('click', function (event) {
    if (event.target.closest('a')) basculer(false);
  });


  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && bouton.getAttribute('aria-expanded') === 'true') {
      basculer(false);
      bouton.focus();
    }
  });
}

function initNavigationActive() {
  const liens = document.querySelectorAll('.nav-liste a[data-section]');
  if (!liens.length || !('IntersectionObserver' in window)) return;

  function marquerActif(idSection) {
    liens.forEach(function (lien) {
      if (lien.dataset.section === idSection) {
        lien.setAttribute('aria-current', 'true');
      } else {
        lien.removeAttribute('aria-current');
      }
    });
  }

  const observateur = new IntersectionObserver(
    function (entrees) {
      entrees.forEach(function (entree) {
        if (entree.isIntersecting) marquerActif(entree.target.id);
      });
    },

    { rootMargin: '-40% 0px -55% 0px' }
  );

  liens.forEach(function (lien) {
    const section = document.getElementById(lien.dataset.section);
    if (section) observateur.observe(section);
  });
}

function initFiltres() {
  const boutons = document.querySelectorAll('[data-filtre]');
  const cartes = document.querySelectorAll('[data-categorie]');
  const compteur = document.getElementById('compteur-projets');
  if (!boutons.length || !cartes.length) return;

  function filtrer(categorie) {
    let visibles = 0;
    cartes.forEach(function (carte) {
      const afficher = categorie === 'tous' || carte.dataset.categorie === categorie;
      carte.hidden = !afficher;
      if (afficher) visibles++;
    });
    if (compteur) {
      compteur.textContent = visibles + (visibles > 1 ? ' projets affichés' : ' projet affiché');
    }
  }

  boutons.forEach(function (bouton) {
    bouton.addEventListener('click', function () {
      boutons.forEach(function (autre) {
        autre.setAttribute('aria-pressed', String(autre === bouton));
      });
      filtrer(bouton.dataset.filtre);
    });
  });
}

function verifierChamp(champ) {
  const valeur = champ.value.trim();

  switch (champ.id) {
    case 'nom':
      if (valeur === '') return 'Saisissez votre nom.';
      if (valeur.length < 2) return 'Le nom doit contenir au moins 2 caractères.';
      return '';

    case 'email': {
      if (valeur === '') return 'Saisissez votre adresse e-mail.';

      const formatEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!formatEmail.test(valeur)) {
        return 'Adresse e-mail invalide. Exemple : prenom@exemple.com';
      }
      return '';
    }

    case 'sujet':
      return valeur === '' ? 'Choisissez un sujet dans la liste.' : '';

    case 'message':
      if (valeur === '') return 'Écrivez votre message.';
      if (valeur.length < 20) {
        return 'Le message est trop court : ' + valeur.length + ' caractères sur 20 minimum.';
      }
      return '';

    default:
      return '';
  }
}

function afficherErreur(champ, message) {
  const zone = document.getElementById('err-' + champ.id);
  if (zone) zone.textContent = message;

  if (message) {
    champ.setAttribute('aria-invalid', 'true');
  } else {
    champ.removeAttribute('aria-invalid');
  }
}

function initFormulaire() {
  const formulaire = document.getElementById('form-contact');
  const statut = document.getElementById('form-statut');
  if (!formulaire || !statut) return;

  const champs = Array.from(formulaire.querySelectorAll('input, select, textarea'));

  champs.forEach(function (champ) {
    // À la sortie du champ : on valide
    champ.addEventListener('blur', function () {
      afficherErreur(champ, verifierChamp(champ));
    });

    champ.addEventListener('input', function () {
      if (champ.getAttribute('aria-invalid') === 'true') {
        afficherErreur(champ, verifierChamp(champ));
      }
    });
  });

  formulaire.addEventListener('submit', function (event) {
    event.preventDefault(); 
    statut.textContent = '';

    let premierChampInvalide = null;
    champs.forEach(function (champ) {
      const message = verifierChamp(champ);
      afficherErreur(champ, message);
      if (message && !premierChampInvalide) premierChampInvalide = champ;
    });

    if (premierChampInvalide) {
      premierChampInvalide.focus();
      return;
    }

    const prenom = document.getElementById('nom').value.trim();
    statut.textContent =
      'Merci ' + prenom + ' ! Votre message est valide. ' +
      '(Démonstration : aucun message n\'a été envoyé.)';
    formulaire.reset();
    statut.focus();
  });
}

function initAnnee() {
  const annee = document.getElementById('annee');
  if (annee) annee.textContent = new Date().getFullYear();
}

initMenu();
initNavigationActive();
initFiltres();
initFormulaire();
initAnnee();
