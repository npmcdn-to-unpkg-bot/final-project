var currentPlaylist = [];
$(document).ready(function() {
  // oauth ajax
  $.ajax({
    url: '/api/oauth',
    type: 'GET',
    dataType: 'json'
  }).done(function(results) {
    console.log(results)
    $('#connect').click(function() {
      location.href=results;

    })
  });
  // new release album ajax
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
        albumImg.addClass('grid-item');
        albumImg.on('click', function() {
          // individual albums ajax
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
      // individual albums ajax
      $.ajax({
        url: '/api/album/'+album.id,
        type: 'GET',
        dataType: 'json'
      }).done(function(album) {
        albumImg = $('<img>').attr('src', album.images[1].url).addClass('grid-item').on('click', function() {
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
    $('.remove-track').on('click', function(event) {
      renderedPlaylist = currentPlaylist.filter(function(track) {
        return event.target.getAttribute('trackId') === track.track_id
      })
      console.log(renderedPlaylist)
      // event.target.parentElement.remove();
    })
    $("#playlist-back-button").on('click', function() {
      $('#playlist-content').remove();
    })
  });

  // create playlist ajax
  $('#submit-playlist').on('click', function() {
    $.ajax({
      url: '/api/createPlaylist/playlist',
      type: 'POST',
      dataType: 'json',
      data: {
        playlist: currentPlaylist
      }
    }).done(function (results) {
      console.log(results);
    })
  })

  // logout ajax
  $('#logout').on('click', function() {
    $.ajax({
      url: '/logout',
      type: 'GET',
      dataType: 'json'
    }).done(
      location.href='http://127.0.0.1:3000'
    )
  })
  // grid stuff
  $('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: 200
  });
});

