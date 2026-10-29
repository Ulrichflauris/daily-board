/* Widget INTL-03 — dépêches. Échantillon statique,
   branchement des flux réels prévu au Sprint 4. */
YCOS.register('news', {
  render: function(el){
    var sample = [
      { title: "Faille critique corrigée dans les passerelles VPN d'entreprise", src: "CERT-FR" },
      { title: "Le NIS2 entre en phase de contrôle dans cinq États membres", src: "RÉGULATION" },
      { title: "Chaîne d'attaque identifiée sur des routeurs domestiques", src: "RECHERCHE" },
      { title: "Rançongiciel remédié en 72 heures : le retour d'expérience", src: "IR" }
    ];
    var items = YCOS_CONFIG.news.enabled
      ? YCOS_CONFIG.news.items : sample;
    var html = '';
    items.slice(0, 5).forEach(function(n){
      html += '<div class="dep">' + YCOS.esc(n.title) +
        '<span class="src">' + YCOS.esc(n.src) + '</span></div>';
    });
    html += '<div class="wline" style="margin-top:10px">' +
      'FLUX RÉEL — BRANCHEMENT AU SPRINT 4</div>';
    el.innerHTML = html;
  }
});
