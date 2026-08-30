// Sections retained for visual grouping; each form now includes a `template` string
const sections = [
	{
		title: "General Search",
		forms: [
			{
				name: "Google",
				template: "https://www.google.com/search?q={q}",
				icon: "https://www.google.com/favicon.ico",
			},
			{
				name: "Bing",
				template: "https://www.bing.com/search?q={q}",
				icon: "https://www.bing.com/sa/simg/favicon-2x.ico",
			},
			{
				name: "Yahoo",
				template: "https://search.yahoo.com/search?p={q}",
				icon: "https://www.google.com/s2/favicons?sz=24&domain_url=https://search.yahoo.com",
			},
			{
				name: "Ecosia",
				template: "https://www.ecosia.org/search?q={q}",
				icon: "https://www.ecosia.org/favicon.ico",
			},
			{
				name: "Baidu",
				template: "https://www.baidu.com/s?wd={q}",
				icon: "https://www.google.com/s2/favicons?sz=24&domain_url=https://www.baidu.com",
			},
			{
				name: "Yandex",
				template: "https://yandex.com/search/?text={q}",
				icon: "https://yandex.com/favicon.ico",
			},
			{
				name: "Naver",
				template: "https://search.naver.com/search.naver?query={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://search.naver.com",
			},
			{
				name: "Sogou",
				template: "https://www.sogou.com/web?query={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://www.sogou.com",
			},
			{
				name: "Ask",
				template: "https://www.ask.com/web?q={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://www.ask.com",
			},
			{
				name: "AOL",
				template: "https://search.aol.com/aol/search?q={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://search.aol.com",
			},
		],
	},
	{
		title: "AI Chatbots",
		forms: [
			{
				name: "ChatGPT",
				template: "https://chat.openai.com/?q={q}",
				icon: "https://chat.openai.com/favicon.ico",
			},
			{
				name: "Gemini",
				template: "https://gemini.google.com/?q={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://gemini.google.com",
			},
			{
				name: "Claude",
				template: "https://www.anthropic.com/claude?query={q}",
				icon: "https://www.anthropic.com/favicon.ico",
			},
			{
				name: "Microsoft Copilot",
				template: "https://copilot.microsoft.com/?q={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://copilot.microsoft.com",
			},
			{
				name: "Perplexity",
				template: "https://www.perplexity.ai/search?q={q}",
				icon: "https://www.google.com/s2/favicons?sz=24&domain_url=https://www.perplexity.ai",
			},
			{
				name: "You.com",
				template: "https://you.com/search?q={q}",
				icon: "https://you.com/favicon.ico",
			},
			{
				name: "DeepSeek",
				template: "https://chat.deepseek.com/?q={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://chat.deepseek.com",
			},
			{
				name: "Bing Chat",
				template: "https://www.bing.com/search?q={q}",
				icon: "https://www.bing.com/sa/simg/favicon-2x.ico",
			},
		],
	},
	{
		title: "Social",
		forms: [
			{
				name: "YouTube",
				template: "https://www.youtube.com/results?search_query={q}",
				icon: "https://www.youtube.com/favicon.ico",
			},
			{
				name: "Facebook",
				template: "https://www.facebook.com/search/top/?q={q}",
				icon: "https://www.google.com/s2/favicons?sz=24&domain_url=//www.facebook.com",
			},
			{
				name: "Instagram",
				template: "https://www.instagram.com/explore/tags/{q}/",
				icon: "https://www.google.com/s2/favicons?sz=24&domain_url=//www.instagram.com",
			},
			{
				name: "Reddit",
				template: "https://www.reddit.com/search/?q={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://www.reddit.com",
			},
			{
				name: "TikTok",
				template: "https://www.tiktok.com/search?q={q}",
				icon: "https://www.tiktok.com/favicon.ico",
			},
			{
				name: "Twitter (X)",
				template: "https://x.com/search?q={q}",
				icon: "https://abs.twimg.com/favicons/twitter.3.ico",
			},
			{
				name: "LinkedIn",
				template: "https://www.linkedin.com/search/results/all/?keywords={q}",
				icon: "https://www.google.com/s2/favicons?sz=24&domain_url=https://www.linkedin.com",
			},
			{
				name: "Pinterest",
				template: "https://www.pinterest.com/search/pins/?q={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://www.pinterest.com",
			},
			{
				name: "Threads",
				template: "https://www.threads.net/search?q={q}",
				icon: "https://www.google.com/s2/favicons?sz=24&domain_url=https://www.threads.net",
			},
			{
				name: "Mastodon",
				template: "https://mastodon.social/search?q={q}",
				icon: "https://www.google.com/s2/favicons?sz=24&domain_url=https://mastodon.social",
			},
			{
				name: "Telegram",
				template: "https://t.me/s/{q}",
				icon: "https://telegram.org/favicon.ico",
			},
		],
	},
	{
		title: "Privacy Search",
		forms: [
			{
				name: "DuckDuckGo",
				template: "https://duckduckgo.com/?q={q}",
				icon: "https://duckduckgo.com/favicon.ico",
			},
			{
				name: "Startpage",
				template: "https://www.startpage.com/sp/search?q={q}",
				icon: "https://www.startpage.com/favicon.ico",
			},
			{
				name: "BraveSearch",
				template: "https://search.brave.com/search?q={q}",
				icon: "https://icons.duckduckgo.com/ip3/search.brave.com.ico",
			},
			{
				name: "Qwant",
				template: "https://www.qwant.com/?q={q}",
				icon: "https://icons.duckduckgo.com/ip3/qwant.com.ico",
			},
			{
				name: "Searx",
				template: "https://www.searx.space/?q={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://www.searx.space",
			},
			{
				name: "Mojeek",
				template: "https://www.mojeek.com/search?q={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://www.mojeek.com",
			},
			{
				name: "Swisscows",
				template: "https://swisscows.com/web?query={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://swisscows.com",
			},
		],
	},
	{
		title: "Movies & Series",
		forms: [
			{
				name: "IMDb",
				template: "https://www.imdb.com/find/?q={q}",
				icon: "https://www.imdb.com/favicon.ico",
			},
			{
				name: "DiscoverFTP",
				template: "https://movies.discoveryftp.net/m/find/{q}",
				icon: "https://movies.discoveryftp.net/assets/images/icon.png",
			},
			{
				name: "TMDB",
				template: "https://www.themoviedb.org/search?query={q}",
				icon: "https://www.themoviedb.org/favicon.ico",
			},
			{
				name: "Letterboxd",
				template: "https://letterboxd.com/search/{q}/",
				icon: "https://letterboxd.com/favicon.ico",
			},
			{
				name: "FlixHQ",
				template: "https://flixhq.gd/browser?keyword={q}",
				icon: "https://flixhq.gd/favicon.ico",
			},
			{
				name: "Soap2Day",
				template: "https://ww25.soap2day.day/?s={q}",
				icon: "https://soap2day.day/favicon.ico",
			},
			{
				name: "1337x",
				template: "https://1337x.st/search/{q}/1/",
				icon: "https://1337x.st/favicon.ico",
			}
		],
	},
	{
		title: "Images & Media",
		forms: [
			{
				name: "Google Images",
				template: "https://www.google.com/search?tbm=isch&q={q}",
				icon: "https://www.google.com/favicon.ico",
			},
			{
				name: "Bing Images",
				template: "https://www.bing.com/images/search?q={q}",
				icon: "https://www.bing.com/sa/simg/favicon-2x.ico",
			},
			{
				name: "Unsplash",
				template: "https://unsplash.com/s/photos/{q}",
				icon: "https://unsplash.com/favicon.ico",
			},
			{
				name: "Flickr",
				template: "https://www.flickr.com/search/?text={q}",
				icon: "https://www.flickr.com/favicon.ico",
			},
			{
				name: "Wikimedia Commons",
				template: "https://commons.wikimedia.org/wiki/Special:Search?search={q}",
				icon: "https://commons.wikimedia.org/static/favicon/wikipedia.ico",
			},
		],
	},
	{
		title: "Cloud & Productivity",
		forms: [
			{
				name: "Google Drive",
				template: "https://drive.google.com/drive/search?q={q}",
				icon: "https://www.gstatic.com/images/branding/product/2x/drive_48dp.png",
			},
			{
				name: "OneDrive",
				template: "https://onedrive.live.com/search?q={q}",
				icon: "https://www.google.com/s2/favicons?sz=24&domain_url=https://onedrive.live.com",
			},
			{
				name: "Dropbox",
				template: "https://www.dropbox.com/search?q={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://www.dropbox.com",
			},
			{
				name: "Notion",
				template: "https://www.notion.so/search?q={q}",
				icon: "https://www.google.com/s2/favicons?sz=24&domain_url=https://www.notion.so",
			},
		],
	},
	{
		title: "Shopping",
		forms: [
			{
				name: "Amazon",
				template: "https://www.amazon.com/s?k={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://www.amazon.com",
			},
			{
				name: "eBay",
				template: "https://www.ebay.com/sch/i.html?_nkw={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://www.ebay.com",
			},
			{
				name: "Walmart",
				template: "https://www.walmart.com/search?q={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://www.walmart.com",
			},
			{
				name: "Etsy",
				template: "https://www.etsy.com/search?q={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://www.etsy.com",
			},
			{
				name: "AliExpress",
				template: "https://www.aliexpress.com/wholesale?SearchText={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://www.aliexpress.com",
			},
		],
	},
	{
		title: "Utilities",
		forms: [
			{
				name: "Wikipedia",
				template: "https://en.wikipedia.org/w/index.php?search={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://www.wikipedia.org",
			},
			{
				name: "Google Maps",
				template: "https://www.google.com/maps/search/{q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://maps.google.com",
			},
			{
				name: "GitHub",
				template: "https://github.com/search?q={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://github.com",
			},
			{
				name: "Stack Overflow",
				template: "https://stackoverflow.com/search?q={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://stackoverflow.com",
			},
			{
				name: "Google Scholar",
				template: "https://scholar.google.com/scholar?q={q}",
				icon: "https://www.google.com/s2/favicons?sz=24&domain_url=scholar.google.com",
			},
			{
				name: "Wolfram Alpha",
				template: "https://www.wolframalpha.com/input/?i={q}",
				icon: "https://www.google.com/s2/favicons?sz=24&domain_url=https://www.wolframalpha.com",
			},
			{
				name: "IMDb",
				template: "https://www.imdb.com/find/?q={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://www.imdb.com",
			},
			{
				name: "Open Street Map",
				template: "https://www.openstreetmap.org/search?query={q}",
				icon: "https://www.openstreetmap.org/favicon.ico",
			},
		],
	},
];

// Expose `sections` to the global scope for the renderer
if (typeof window !== "undefined") {
	window.sections = sections;
}
