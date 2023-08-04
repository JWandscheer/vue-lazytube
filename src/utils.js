import "whatwg-fetch";

/** Helper method to fetch oembed data  */
const fetchingOembed = async (src, type = "youtube") => {
	const url =
		type === "youtube"
			? `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${getYouTubeID(
					src
			  )}&format=json`
			: `https://vimeo.com/api/oembed.json?url=${src}`;

	return await window.fetch(url);
};

/** Helper method to dynamically create iframe  */
const createIframe = (
	videoID,
	getTitle,
	iframeClass,
	type = "youtube",
	flag = true
) => {
	let iframeEl = null;
	if (flag) {
		iframeEl = document.createElement("iframe");
		if (type === "youtube") {
			iframeEl.setAttribute(
				"src",
				`https://www.youtube.com/embed/${videoID}?enablejsapi=1&autoplay=1&rel=0`
			);
		} else {
			iframeEl.setAttribute(
				"src",
				`https://player.vimeo.com/video/${videoID}?autoplay=1`
			);
		}
		iframeEl.setAttribute("frameborder", "0");
		iframeEl.setAttribute(
			"allow",
			"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
		);
		iframeEl.setAttribute("allowfullscreen", "1");
		iframeEl.setAttribute("title", `${getTitle}`);
		iframeEl.setAttribute("class", `${iframeClass}`);
	}

	return iframeEl;
};

/** Helper method to check if postMessage features is available  */
const isPostMessageSupported = () => {
	if (!window.postMessage) {
		return false;
	}
	return true;
};

/** Helper method to calculate aspect  */
const calcAspect = (aspect) => {
	const aspects = aspect.split(":");

	return typeof aspects[1] === "undefined"
		? 56.25
		: (aspects[1] / aspects[0]) * 100;
};

/** Helper method to get youtube video ID from url  */
const getYouTubeID = (url) => {
	url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/u);
	/* eslint-disable no-useless-escape */
	return url[2] !== undefined ? url[2].split(/[^0-9a-z_\-]/iu)[0] : url[0];
};

/** Helper method to get vimeo video ID from url  */
const getVimeoID = (url) => {
	return new URL(url).pathname.split("/").pop();
};

/** Helper method to get Thumbnail for youtube video */
const getYoutubeThumbnail = (video_id, quality, webp = false) => {
	if (video_id) {
		if (typeof quality === "undefined") {
			quality = "high";
		}
    const webp_string = webp ? "_webp" : ""
    const format_string = webp ? "webp" : "jpg"

		let quality_key = "maxresdefault"; // Max quality
		if (quality === "default") {
			quality_key = "default";
		} else if (quality === "medium") {
			quality_key = "mqdefault";
		} else if (quality === "high") {
			quality_key = "hqdefault";
		} else if (quality === "standard") {
			quality_key = "sddefault";
		} else if (quality === "maxres") {
			quality_key = "maxresdefault";
		}

		return (
			"https://img.youtube.com/vi" + webp_string + "/" + video_id + "/" + quality_key + "." + format_string
		);
	}

	return false;
};

/** Get Youtube Thumbnail srcset */
const getYoutubeThumbnailSrcset = (video_id) => {
  if (video_id) {
    const qualities = [
      {
        key: "default",
        width: 120,
      },
      {
        key: "mqdefault",
        width: 320,
      },
      {
        key: "hqdefault",
        width: 480,
      },
      {
        key: "sddefault",
        width: 640,
      },
      {
        key: "maxresdefault",
        width: 1280,
      },
    ];

    const formats = ['jpg', 'webp']

    // Build srcsets as array with formats as keys for jpeg and webp from qualities with getYoutubeThumbnail()
    const srcsets = {};
    formats.forEach((format) => {
      srcsets[format] = [];
      qualities.forEach((quality) => {
        srcsets[format].push(`${getYoutubeThumbnail(video_id, quality.key, format)} ${quality.width}w`);
      });
      srcsets[format] = srcsets[format].join(', ');
    });

    return srcsets;
  }

  return false;
};

/** Helper method to get Thumbnail for vimeo video */
const getVimeoThumbnail = (video_id, quality) => {
	if (video_id) {
		if (typeof quality === "undefined") {
			quality = "high";
		}

		let quality_key = "960x540";
		if (quality === "default") {
			quality_key = "200x150";
		} else if (quality === "medium") {
			quality_key = "295x166";
		} else if (quality === "high") {
			quality_key = "640x360";
		} else if (quality === "standard") {
			quality_key = "960x540";
		} else if (quality === "maxres") {
			quality_key = "1280x720";
		}
		return (
			"https://i.vimeocdn.com/video/" + video_id + "_" + quality_key + ".jpg"
		);
	}

	return false;
};

export {
	createIframe,
	isPostMessageSupported,
	calcAspect,
	fetchingOembed,
	getYouTubeID,
	getYoutubeThumbnail,
	getVimeoID,
	getVimeoThumbnail,
  getYoutubeThumbnailSrcset
};
