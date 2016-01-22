$(document).ready(function() {
  // oauth ajax
  $.ajax({
    url: '/api/oauth',
    type: 'GET',
    dataType: 'json'
  }).done(function(results) {
    $('#connect').click(function() {
      location.href=results
    })
  });
  // albums ajax
  i=0
  $.ajax({
    url: '/api/newReleases',
    type: 'GET',
    dataType: 'json'
  }).done(function(results){
    parsedResults = JSON.parse(results)
    albums = parsedResults.albums.items
    console.log(albums)
    albums.forEach(function(album) {
      // i++;
      albumImg = $('<img>').attr('src', album.images[2].url);
      albumImg.addClass('grid-item');
      // if (i>15){
      //   albumImg.addClass('grid-item--width2');
      //   albumImg.addClass('grid-item--height2');
      // } else if (i>10 && i<15) {
      //   albumImg.addClass('grid-item--width3');
      //   albumImg.addClass('grid-item--height3');
      // } else if (i>5 && i<10) {
      //   albumImg.addClass('grid-item--height4');
      //   albumImg.addClass('grid-item--width4');
      // }
      albumImg.on('click', function() {
        $.ajax({
          url: '/api/album/'+album.id,
          type: 'GET',
          dataType: 'json'
        }).done(function(album) {
          artist = album.artists[0];
          tracks = album.tracks;
          // handle bars?
          console.log(artist);
          console.log(tracks);
          console.log(album);
        })
      })
      $('#album-container').append(albumImg);
    })
  });
  j=0;
  $.ajax({
    url: '/api/newReleasesTwo',
    type: 'GET',
    dataType: 'json'
  }).done(function(results){
    parsedResults = JSON.parse(results)
    albums = parsedResults.albums.items
    console.log(albums)
    albums.forEach(function(album) {
      // j++;
      albumImg = $('<img>').attr('src', album.images[2].url);
      albumImg.addClass('grid-item');
      // if (j>17){
      //   albumImg.addClass('grid-item--width2');
      //   albumImg.addClass('grid-item--height4');
      // } else if (j>14 && i<17) {
      //   albumImg.addClass('grid-item--width3');
      //   albumImg.addClass('grid-item--height2');
      // } else if (j>10 && i<14) {
      //   albumImg.addClass('grid-item--height4');
      // } else if (j>6 && i<10) {
      //   albumImg.addClass('grid-item--width4');
      //   albumImg.addClass('grid-item--height2');
      // } else if (j>3 && i<6) {
      //   albumImg.addClass('grid-item--width3');
      // }
      albumImg.on('click', function() {
        $.ajax({
          url: '/api/album/'+album.id,
          type: 'GET',
          dataType: 'json'
        }).done(function(album) {
          artist = album.artists[0];
          tracks = album.tracks;
          // handle bars?
          console.log(artist);
          console.log(tracks);
          console.log(album);
        })
      })
      $('#album-container').append(albumImg);
    })
  });
  $('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: 200
  });
});

