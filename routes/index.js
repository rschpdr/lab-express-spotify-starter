const router = require("express").Router();
const { configSpotify, spotifyApi } = require("../config/spotify-config");
// Executa a funcao para autentica no Spotify no momento que o arquivo e carregado
configSpotify()
  .then((data) => {
    console.log("Spotify API authenticated!", data);
  })
  .catch((err) => console.error(err));

// Pagina inicial com o formulario de pesquisa
router.get("/", (req, res) => res.render("home"));

// Rota que recebe busca do usuario e pesquis na API do Spotify
router.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artistSearch)
    .then((artistsResult) => {
      console.log("Artist Search Result =>", artistsResult.body.artists.items);

      res.render("searchResult", { artists: artistsResult.body.artists.items });
    })
    .catch((err) => console.error(err));
});

// Rota que recebe o ID do artista via parametro de rota e busca todos os albums deste artista
router.get("/albums/:id", async (req, res) => {
  try {
    // Buscar todos os albuns de um artista na API do Spotify usando o id que recebemos do resultado da busca como parametro
    const result = await spotifyApi.getArtistAlbums(req.params.id);

    res.render("albums", { albums: result.body.items });
    console.log(result.body.items);
  } catch (err) {
    console.error(err);
  }
});

// Rota que recebe o ID do album via parametro de rota e busca todas as musicas deste album
router.get("/tracks/:albumId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then((result) => {
      console.log(result.body.items);

      res.render("tracks", {
        tracks: result.body.items.sort(
          (a, b) => a.track_number - b.track_number
        ),
      });
    })
    .catch((err) => console.error(err));
});

module.exports = router;
