let run_num = 1;
function running() {
  run_num++;
  if(run_num > 7){
    run_num = 1;
  }
  $('.run').hide();
  $('.run' + run_num).show();
}


$(() => {
  let img_count = $('img').length;

  let loaded = 0;
  $('.run').one('load', () => {
    loaded++;
    $('#loading-progress').text(loaded / img_count * 220 + '%');
    if (loaded == img_count) {
      $('#main').show();
      $('#loading').hide();
    }
  }).each(function() {
    if (this.complete) {
      $(this).trigger('load');
    }
  });

  let keybinds = {};

  $('.button').each(function() {
    let { keybind } = this.dataset;

    if (keybind) {
      keybinds[keybind.toLowerCase()] = this;
    }
  });

  $(document).keyup((e) => {
    let keybind = keybinds[e.key];

    if (keybind) {
      keybind.click();
    }
  })

  let now = 'D';

  let pressTimes = [];
  let average_time = 1;

  setInterval(() => {
    let currentTime = Date.now();
    pressTimes = pressTimes.filter(time => currentTime - time <= average_time * 1000); // keep only last 10 seconds
    let pps = pressTimes.length / average_time; // calculate moving average pps
    if(pps > 10){
      $('#running').addClass('fastest');
    } else if(pps > 5) {
      $('#running').addClass('fast');
    } else {
      $('#running').removeClass('fast').removeClass('fastest');
    }

    // show pps
    $('#pps').text(pps.toFixed(0));
  }, 50);

  $('.button').click(function() {
    let { keybind } = this.dataset;

    if((keybind == 'A' && now == 'D') || (keybind == 'D' && now == 'A')){
      // calc pps
      let currentTime = Date.now();
      pressTimes.push(currentTime);

      this.classList.add('active');
      setTimeout(() => {
        this.classList.remove('active');
      }, 50);


      running();
      now = keybind;


    }
  })

})
