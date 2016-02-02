var currentPlaylist = [];

var createModal = function(element, context) {
  var source = element.html();
  var template = Handlebars.compile(source);
  var html = template(context);
  var shadow = $('<div>').addClass('shadow');
  $('body').append(shadow);
  $('body').append(html);
  $('.shadow').on('click', function() {
    $('.shadow').remove();
    $('.modal').remove();
  });
  $("#back-button").on('click', function() {
    $('.modal').remove();
    $('.shadow').remove();
  });
};

var deleteModal = function() {
  if ($('.modal')) {
    $('.modal').remove();
    $('.shadow').remove();
  };
};

$(document).ready(function() {
  // oauth ajax
  $.ajax({
    url: '/api/oauth',
    type: 'GET',
    dataType: 'json'
  }).done(function(results) {
    $('#connect').click(function() {
      location.href=results;
    });
  });
  // new release album ajax
  $.ajax({
    url: '/api/newReleases',
    type: 'GET',
    dataType: 'json'
  }).done(function(results){
    parsedResults = JSON.parse(results);
    albums = parsedResults.albums.items;
    newAlbums = [];
    for( var i=0; i<albums.length-1; i++ ) {
      if (!(albums[i].name == albums[i+1].name)) {
        newAlbums.push(albums[i]);
      };
    };
    newAlbums.forEach(function(album) {
      $.ajax({
        url: '/api/album/'+album.id,
        type: 'GET',
        dataType: 'json'
      }).done(function(album) {
        albumImg = $('<img>').attr('src', album.images[1].url).addClass('grid-item').on('click', function() {
          // individual albums ajax
          $.ajax({
            url: '/api/album/'+album.id,
            type: 'GET',
            dataType: 'json'
          }).done(function(album) {
            // modals with handlebars
            if ($('#album-content')) {
              $('.modal').remove();
            };
            artist = album.artists[0].name;
            tracks = album.tracks.items;
            createModal($("#entry-template"), {album_name: album.name, tracks: tracks, artist: artist});
            $(".add-button").on('click', function(event) {
              track_id = event.target.getAttribute('track_id');
              artist = $('#artist-name').text();
              track_name = event.target.getAttribute('track_name');
              currentPlaylist.push({spotify_id: track_id, track_name: track_name, track_artist: artist, current: true});
            });
            $('.play-track').on('click', function(event) {
              window.open('http://localhost:3000/api/player/spotify:track:'+event.target.getAttribute('track_id'), 'musicPlayer', "height=400,width=350,background=black");
            });
          });
        });
        $('#album-container').append(albumImg);
      });
    });
  });
  // User modal
  $('#my_page').on('click', function() {
    deleteModal();
    $.ajax({
      url: '/api/getUser',
      type: 'GET',
      dataType: 'json'
    }).done(function(user) {
      createModal($('#user-modal-template'), {user_name: user.username, playlists: user.playlists});
      // view past playlist
      $('.view-playlist-button').on('click', function(event) {
        $.ajax({
          url: '/api/playlist',
          type: 'POST',
          data: {
            playlist_name: event.target.getAttribute('playlist')
          },
          dataType: 'json'
        }).done(function(results) {
          var spotify_play_id = results.spotify_playlist_id;
          deleteModal();
          createModal($("#entry-template-two"), {playlist_name: results.playlist_name, tracks: results.tracks, past: true, playlist_id: results.spotify_playlist_id});
          $(".play-playlist").on('click', function(event) {
            $.ajax({
              url: 'api/getUser/spotify',
              type: 'GET',
              dataType: 'json'
            }).done(function(results) {
              window.open('http://localhost:3000/api/player/'+spotify_play_id, 'musicPlayer', "height=300,width=380");
            });
          });
        });
      });
    });
  });
  // view current playlist
  $('#view-playlist').on('click', function() {
    deleteModal();
    createModal($("#entry-template-two"), {playlist_name: 'Current Playlist', tracks: currentPlaylist, current: true});
    $('.remove-track').on('click', function(event) {
      currentPlaylist = currentPlaylist.filter(function(track) {
        if (event.target.getAttribute('track_id') === track.spotify_id) {
          return false;
        } else {
          return track;
        };
      });
      deleteModal();
      createModal($("#entry-template-two"), {playlist_name: "Current Playlist", tracks: currentPlaylist, current: true});
      $('#delete-button').on('click', function() {
        currentPlaylist = [];
        deleteModal();
      });
      $('#submit-playlist').on('click', function() {
        if ($('playlist-title').val() === '') {
          event.preventDefault();
        };
        currentPlaylist = currentPlaylist.filter(function(track) {
          track.current = false;
          return track;
        });
        $.ajax({
          url: '/api/createPlaylist/'+$('#playlist-title').val(),
          type: 'POST',
          dataType: 'json',
          data: {
            playlist: currentPlaylist
          }
        }).done(function (results) {
          currentPlaylist = [];
          deleteModal();
        })
      })
    })
    // dump current playlist
    $('.delete-button').on('click', function() {
      currentPlaylist = [];
      deleteModal();
    })
    // create playlist
    $('#submit-playlist').on('click', function() {
      if ($('playlist-title').val() === '') {
        event.preventDefault();
      };
      currentPlaylist.current = false;
      currentPlaylist = currentPlaylist.filter(function(track) {
        track.current = false;
        return track;
      });
      $.ajax({
        url: '/api/createPlaylist/'+$('#playlist-title').val(),
        type: 'POST',
        dataType: 'json',
        data: {playlist: currentPlaylist}
      }).done(function (results) {
        currentPlaylist = [];
        deleteModal();
      });
    });
  });

  // logout ajax
  $('#logout').on('click', function() {
    $.ajax({
      url: '/logout',
      type: 'GET',
      dataType: 'json'
    }).done(
      location.href='http://localhost:3000/'
    );
  });
  // grid stuff
  $('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: 200
  });
});

