var currentPlaylist = [];
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
  $.ajax({
    url: '/api/newReleases',
    type: 'GET',
    dataType: 'json'
  }).done(function(results){
    parsedResults = JSON.parse(results)
    albums = parsedResults.albums.items
    console.log(albums)
    albums.forEach(function(album) {
      $.ajax({
        url: '/api/album/'+album.id,
        type: 'GET',
        dataType: 'json'
      }).done(function(album) {
        albumImg = $('<img>').attr('src', album.images[1].url);
        // size = album.popularity+200
        // albumImg.css('width', size);
        // albumImg.css('height', size);
        albumImg.addClass('grid-item');
        albumImg.on('click', function() {
          $.ajax({
            url: '/api/album/'+album.id,
            type: 'GET',
            dataType: 'json'
          }).done(function(album) {
            // modals with handlebars
            if ($('#album-content')) {
              $('#album-content').remove();
            }
            artist = album.artists[0].name;
            tracks = album.tracks.items;
            console.log(album);
            var source = $("#entry-template").html();
            var template = Handlebars.compile(source);
            var context = {album_name: album.name, tracks: tracks, artist: artist};
            var html = template(context);
            $('body').append(html);
            $("#album-back-button").on('click', function() {
              $('#album-content').remove();
            })
            $(".add").on('click', function(event) {
              track_id = event.target.getAttribute('trackId');
              artist = $('#artist-name').text();
              track_name = event.target.getAttribute('trackName');
              currentPlaylist.push({track_id: track_id, track_name: track_name, track_artist: artist});
              console.log(currentPlaylist);
              var source = $("#entry-template-two").html();
              var template = Handlebars.compile(source);
              var context = {playlist_name: album.name, tracks: currentPlaylist}
              var html = template(context);
              $("#playlist-back-button").on('click', function() {
                $('#playlist-content').remove();
              })
            })
          })
        })
        $('#album-container').append(albumImg);
      });
    // size based on popularity?
    })
  });
  $.ajax({
    url: '/api/newReleasesTwo',
    type: 'GET',
    dataType: 'json'
  }).done(function(results){
    parsedResults = JSON.parse(results)
    albums = parsedResults.albums.items
    console.log(albums)
    albums.forEach(function(album) {
      $.ajax({
        url: '/api/album/'+album.id,
        type: 'GET',
        dataType: 'json'
      }).done(function(album) {
        albumImg = $('<img>').attr('src', album.images[1].url);
        // size = album.popularity+200
        // albumImg.css('width', size);
        // albumImg.css('height', size);
        albumImg.addClass('grid-item');
        albumImg.on('click', function() {
          $.ajax({
            url: '/api/album/'+album.id,
            type: 'GET',
            dataType: 'json'
          }).done(function(album) {
            // modals with handlebars
            if ($('#album-content')) {
              $('#album-content').remove();
            }
            artist = album.artists[0].name;
            tracks = album.tracks.items;
            console.log(album);
            var source = $("#entry-template").html();
            var template = Handlebars.compile(source);
            var context = {album_name: album.name, tracks: tracks, artist: artist};
            var html = template(context);
            $('body').append(html);
            $("#album-back-button").on('click', function() {
              $('#album-content').remove();
            })
            $(".add").on('click', function(event) {
              track_id = event.target.getAttribute('trackId');
              artist = $('#artist-name').text();
              track_name = event.target.getAttribute('trackName');
              currentPlaylist.push({track_id: track_id, track_name: track_name, track_artist: artist});
              console.log(currentPlaylist);
            })
          })
        })
        $('#album-container').append(albumImg);
      });
    // size based on popularity?
    })
  });
  // view playlist
  $('#view-playlist').on('click', function() {
    var source = $("#entry-template-two").html();
    var template = Handlebars.compile(source);
    var context = {playlist_name: 'Playlist', tracks: currentPlaylist}
    var html = template(context);
    $('body').append(html);
    $("#playlist-back-button").on('click', function() {
      $('#playlist-content').remove();
    })
  });
  // login ajax
  $('#login').on('submit', function(event) {
    event.preventDefault();
    $.ajax({
      url: '/api/createAlex',
      type: 'GET',
      dataType: 'json'
    }).done(function (results) {
      console.log(results)
    })
  })
  // grid stuff
  $('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: 200
  });
});

