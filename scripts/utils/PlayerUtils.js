/**
 * 播放器工具类
 */
/**
 * 获取正在播放歌曲ID
 * @param player
 * @param playlists
 * @returns {null}
 */
export function getPlayingSongId(player, playlists) {
    if (player.currentSongIndex !== null) {
        const playingPlaylistKey = player.selectedPlaylists[player.selectedPlaylists.length - 1];
        const playlist = playlists[playingPlaylistKey];
        return playlist.items[player.currentSongIndex];
    }

    return null;
}

/**
 * 获取正在播放歌曲列表
 * @param player
 * @returns {*}
 */
export function getPlayingPlaylist(player) {
    if (player.selectedPlaylists.length === 0) {
        return null;
    }

    return player.selectedPlaylists[player.selectedPlaylists.length - 1];
}
