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
    newAlbums = [];
    // stack overflow (come back to this)
    // albums.sort( function( a, b){ return a.id - b.id; } );

    // delete all duplicates from the array
    for( var i=0; i<albums.length-1; i++ ) {
      if (!(albums[i].name == albums[i+1].name)) {
        newAlbums.push(albums[i]);
      }
    }
    //end of stack overflow

    console.log(newAlbums)
    newAlbums.forEach(function(album) {
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
              $('.modal').remove();
            }
            artist = album.artists[0].name;
            tracks = album.tracks.items;
            console.log(album);
            var source = $("#entry-template").html();
            var template = Handlebars.compile(source);
            var context = {album_name: album.name, tracks: tracks, artist: artist};
            var html = template(context);
            var shadow = $('<div>').addClass('shadow');
            $('body').append(shadow);
            $('body').append(html);
            $('.shadow').on('click', function() {
              $('.shadow').remove();
              $('.modal').remove();
            })
            $("#back-button").on('click', function() {
              $('.modal').remove();
              $('.shadow').remove();
            })
            $(".add").on('click', function(event) {
              track_id = event.target.getAttribute('trackId');
              artist = $('#artist-name').text();
              track_name = event.target.getAttribute('trackName');
              currentPlaylist.push({spotify_id: track_id, track_name: track_name, track_artist: artist, current: true});
            })
            $('.play-track').on('click', function(event) {
              window.open('https://blooming-stream-74013.herokuapp.com/api/player/spotify:track:'+event.target.getAttribute('track_id'), 'musicPlayer', "height=300,width=380")
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
    newAlbums = [];
    for( var i=0; i<albums.length-1; i++ ) {
      if (!(albums[i].name == albums[i+1].name)) {
        newAlbums.push(albums[i]);
      }
    }
    console.log(newAlbums)
    newAlbums.forEach(function(album) {
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
            if ($('.modal')) {
              $('.modal').remove();
            }
            artist = album.artists[0].name;
            tracks = album.tracks.items;
            var source = $("#entry-template").html();
            var template = Handlebars.compile(source);
            var context = {album_name: album.name, tracks: tracks, artist: artist};
            var html = template(context);
            var shadow = $('<div>').addClass('shadow');
            $('body').append(shadow);
            $('body').append(html);
            $('.shadow').on('click', function() {
              $('.modal').remove();
              $('.shadow').remove();
            })
            $("#back-button").on('click', function() {
              $('.modal').remove();
              $('.shadow').remove();
            })
            $(".add").on('click', function(event) {
              track_id = event.target.getAttribute('trackId');
              artist = $('#artist-name').text();
              track_name = event.target.getAttribute('trackName');
              currentPlaylist.push({spotify_id: track_id, track_name: track_name, track_artist: artist, current: true});
            })
            $('.play-track').on('click', function(event) {
              window.open('https://blooming-stream-74013.herokuapp.com/api/player/spotify:track:'+event.target.getAttribute('track_id'), 'musicPlayer', "height=300,width=380")
            })
          })
        })
        $('#album-container').append(albumImg);
      });
    // size based on popularity?
    })
  });
  $.ajax({
    url: '/api/newReleasesThree',
    type: 'GET',
    dataType: 'json'
  }).done(function(results){
    parsedResults = JSON.parse(results)
    albums = parsedResults.albums.items
    newAlbums = [];
    for( var i=0; i<albums.length-1; i++ ) {
      if (!(albums[i].name == albums[i+1].name)) {
        newAlbums.push(albums[i]);
      }
    }
    console.log(newAlbums)
    newAlbums.forEach(function(album) {
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
            if ($('.modal')) {
              $('.modal').remove();
            }
            artist = album.artists[0].name;
            tracks = album.tracks.items;
            var source = $("#entry-template").html();
            var template = Handlebars.compile(source);
            var context = {album_name: album.name, tracks: tracks, artist: artist};
            var html = template(context);
            var shadow = $('<div>').addClass('shadow');
            $('body').append(shadow);
            $('body').append(html);
            $('.shadow').on('click', function() {
              $('.modal').remove();
              $('.shadow').remove();
            })
            $("#back-button").on('click', function() {
              $('.modal').remove();
              $('.shadow').remove();
            })
            $(".add").on('click', function(event) {
              track_id = event.target.getAttribute('trackId');
              artist = $('#artist-name').text();
              track_name = event.target.getAttribute('trackName');
              currentPlaylist.push({spotify_id: track_id, track_name: track_name, track_artist: artist, current: true});
            })
            $('.play-track').on('click', function(event) {
              window.open('https://blooming-stream-74013.herokuapp.com/api/player/spotify:track:'+event.target.getAttribute('track_id'), 'musicPlayer', "height=300,width=380")
            })
          })
        })
        $('#album-container').append(albumImg);
      });
    // size based on popularity?
    })
  });
  // User modal
  $('#my_page').on('click', function() {
    if ($('.modal')) {
      $('.modal').remove();
    }
    $.ajax({
      url: '/api/getUser',
      type: 'GET',
      dataType: 'json'
    }).done(function(user) {
      console.log(user)
      var source = $('#user-modal-template').html();
      var template = Handlebars.compile(source);
      var context = {user_name: user.username, playlists: user.playlists};
      var html = template(context);
      var shadow = $('<div>').addClass('shadow');
      $('body').append(shadow);
      $('body').append(html);
      $("#back-button").on('click', function() {
        $('.modal').remove();
        $('.shadow').remove();
      })
      $('.shadow').on('click', function() {
        $('.shadow').remove();
        $('.modal').remove();
      })
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
          console.log(results)
          if ($('.modal')) {
            $('.modal').remove();
            $('.shadow').remove();
          }
          var source = $("#entry-template-two").html();
          var template = Handlebars.compile(source);
          var context = {playlist_name: results.playlist_name, tracks: results.tracks, past: true, playlist_id: results.spotify_playlist_id}
          var html = template(context);
          var shadow = $('<div>').addClass('shadow');
          $('body').append(shadow);
          $('body').append(html);
          $('.shadow').on('click', function() {
            $('.shadow').remove();
            $('.modal').remove();
          })
          $("#back-button").on('click', function() {
            $('.modal').remove();
            $('.shadow').remove();
          })
          $("#play-playlist").on('click', function(event) {
            console.log(event.target.getAttribute('playlist-id'));
            $.ajax({
              url: 'api/getUser/spotify',
              type: 'GET',
              dataType: 'json'
            }).done(function(results) {
              console.log(results)
              window.open('https://blooming-stream-74013.herokuapp.com/api/player/'+event.target.getAttribute('playlist_list'), 'musicPlayer', "height=300,width=380")
            })
          })
        })
      });
    })
  })
  // view current playlist
  $('#view-playlist').on('click', function() {
    if ($('.modal')) {
      $('.modal').remove();
      $('.shadow').remove();
    }
    var source = $("#entry-template-two").html();
    var template = Handlebars.compile(source);
    var context = {playlist_name: 'Current Playlist', tracks: currentPlaylist, current: true}
    var html = template(context);
    var shadow = $('<div>').addClass('shadow');
    $('body').append(shadow);
    $('body').append(html);
    $('.shadow').on('click', function() {
      $('.shadow').remove();
      $('.modal').remove();
    })
    $('.remove-track').on('click', function(event) {
      currentPlaylist = currentPlaylist.filter(function(track) {
        if (event.target.getAttribute('track_id') === track.spotify_id) {
          return false
        } else {
          return track
        }
      })
      if ($('.modal')) {
        $('.shadow').remove();
        $('.modal').remove();
      }
      var source = $("#entry-template-two").html();
      var template = Handlebars.compile(source);
      var context = {playlist_name: "Current Playlist", tracks: currentPlaylist, current: true}
      var html = template(context);
      var shadow = $('<div>').addClass('shadow');
      $('body').append(shadow);
      $('body').append(html);
      $('.shadow').on('click', function() {
        $('.shadow').remove();
        $('.modal').remove();
      })
      $("#back-button").on('click', function() {
        $('.modal').remove();
        $('.shadow').remove();
      })
      $('#submit-playlist').on('click', function() {
        if ($('playlist-title').val() === '') {
          event.preventDefault();
        }
        // currentPlaylist.current = false;
        currentPlaylist = currentPlaylist.filter(function(track) {
          track.current = false;
          return track
        })
        console.log(currentPlaylist)
        $.ajax({
          url: '/api/createPlaylist/'+$('#playlist-title').val(),
          type: 'POST',
          dataType: 'json',
          data: {
            playlist: currentPlaylist
          }
        }).done(function (results) {
          currentPlaylist = [];
          $('.modal').remove();
          $('.shadow').remove();
        })
      })
    })
    $("#back-button").on('click', function() {
      $('.modal').remove();
      $('.shadow').remove();
    })
    // create playlist
    $('#submit-playlist').on('click', function() {
      if ($('playlist-title').val() === '') {
        event.preventDefault();
      }
      currentPlaylist.current = false;
      currentPlaylist = currentPlaylist.filter(function(track) {
        track.current = false;
        return track
      })
      $.ajax({
        url: '/api/createPlaylist/'+$('#playlist-title').val(),
        type: 'POST',
        dataType: 'json',
        data: {
          playlist: currentPlaylist
        }
      }).done(function (results) {
        console.log(results);
        currentPlaylist = [];
        $('.modal').remove();
        $('.shadow').remove();
      })
    })
  });

  // logout ajax
  $('#logout').on('click', function() {
    $.ajax({
      url: '/logout',
      type: 'GET',
      dataType: 'json'
    }).done(
      location.href='https://blooming-stream-74013.herokuapp.com/'
    )
  })
  // grid stuff
  $('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: 200
  });
});

