export const BASE_URL = "https://thesourceofhope.org";
export const ASSET_VERSION = "v2";

export const ROUTES = {
	home: { path: "" },

	about: {
		path: "about",
		children: {
			team: "team",
		},
	},

	serve: {
		path: "serve",
		children: {
			servingHope: "servingHope",
			educationHope: "educationHope",
			wellnessHope: "wellnessHope",
			outdoorHope: "outdoorHope",
			internationalHope: "internationalHope",
		},
	},

	connect: { path: "connect" },
	media: {
		path: "media",
		children: {
			podcast: "podcast",
			press: "press",
		},
	},
	member: { path: "members" },
	storefront: {
		path: "store",
		children: {
			products: "product",
			cart: "cart",
			success: "success",
		},
	},
};

function normalize(path) {
	return path.replace(/\/+/g, "/");
}

function build(node, base = "") {
	const segment = node.path ? `${base}/${node.path}` : base;
	const full = normalize(segment);

	let map = {
		absolute: full || "/",
		relative: full.replace(/^\//, ""),
	};

	if (node.children) {
		for (const [key, child] of Object.entries(node.children)) {
			const childPath = normalize(`${full}/${child}`);
			map[key] = {
				absolute: childPath,
				relative: childPath.replace(/^\//, ""),
			};
		}
	}

	return map;
}

export const CANONICAL = {
	home: { absolute: "/", relative: "" },

	about: build(ROUTES.about),
	serve: build(ROUTES.serve),
	connect: build(ROUTES.connect),
	media: build(ROUTES.media),
	member: build(ROUTES.member),
	storefront: build(ROUTES.storefront),
};

export const CANONICAL_URL = Object.fromEntries(
	Object.entries(CANONICAL).map(([key, value]) => [
		key,
		`${BASE_URL}${value.absolute}`,
	]),
);
