document.getElementById("aBtn").onclick = function() {
    require.ensure([], function() {
      var awork = require('./pageOne')
    },
    'page');
    require.ensure([], function(){
      var aworka = require('./multi');
    }, 'stepone');
}