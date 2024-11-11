import { environment } from "src/environments/environment";

const BASE_URL = environment.production ? '' : 'http://localhost:5000';
export const API_BASE_URL = environment.production ? 'https://your-production-backend-url' : 'http://localhost:5000';

export const FOODS_URL = BASE_URL + '/api/foods';
export const FOODS_TAGS_URL = FOODS_URL + '/tags';
export const FOODS_BY_SEARCH_URL = FOODS_URL + '/search/';
export const FOODS_BY_TAG_URL = FOODS_URL + '/tag/';
export const FOOD_BY_ID_URL = FOODS_URL + '/';


export const BOUTIQUES_URL = BASE_URL + '/api/boutiques';
export const BOUTIQUES_TAGS_URL = BOUTIQUES_URL + '/tags';
export const BOUTIQUES_BY_SEARCH_URL = BOUTIQUES_URL + '/search/';
export const BOUTIQUES_BY_TAG_URL = BOUTIQUES_URL + '/tag/';
export const BOUTIQUE_BY_ID_URL = BOUTIQUES_URL + '/';


export const FURNITURES_URL = BASE_URL + '/api/furnitures';
export const FURNITURES_TAGS_URL = FURNITURES_URL + '/tags';
export const FURNITURES_BY_SEARCH_URL = FURNITURES_URL + '/search/';
export const FURNITURES_BY_TAG_URL = FURNITURES_URL + '/tag/';
export const FURNITURE_BY_ID_URL = FURNITURES_URL + '/';


export const BAKERYS_URL = BASE_URL + '/api/bakerys';
export const BAKERYS_TAGS_URL = BAKERYS_URL + '/tags';
export const BAKERYS_BY_SEARCH_URL = BAKERYS_URL + '/search/';
export const BAKERYS_BY_TAG_URL = BAKERYS_URL + '/tag/';
export const BAKERY_BY_ID_URL = BAKERYS_URL + '/';

export const ALCOHOLS_URL = BASE_URL + '/api/alcohols';
export const ALCOHOLS_TAGS_URL = ALCOHOLS_URL + '/tags';
export const ALCOHOLS_BY_SEARCH_URL = ALCOHOLS_URL + '/search/';
export const ALCOHOLS_BY_TAG_URL = ALCOHOLS_URL + '/tag/';
export const ALCOHOL_BY_ID_URL = ALCOHOLS_URL + '/';


export const COSMETICS_URL = BASE_URL + '/api/cosmetics';
export const COSMETICS_TAGS_URL = COSMETICS_URL + '/tags';
export const COSMETICS_BY_SEARCH_URL = COSMETICS_URL + '/search/';
export const COSMETICS_BY_TAG_URL = COSMETICS_URL + '/tag/';
export const COSMETIC_BY_ID_URL = COSMETICS_URL + '/';



export const REALS_URL = BASE_URL + '/api/reals';
export const REALS_TAGS_URL = REALS_URL + '/tags';
export const REALS_BY_SEARCH_URL = REALS_URL + '/search/';
export const REALS_BY_TAG_URL = REALS_URL + '/tag/';
export const REAL_BY_ID_URL = REALS_URL + '/';

export const PHARMS_URL = BASE_URL + '/api/pharms';
export const PHARMS_TAGS_URL = PHARMS_URL + '/tags';
export const PHARMS_BY_SEARCH_URL = PHARMS_URL + '/search/';
export const PHARMS_BY_TAG_URL = PHARMS_URL + '/tag/';
export const PHARM_BY_ID_URL = PHARMS_URL + '/';


export const MARKETS_URL = BASE_URL + '/api/markets';
export const MARKETS_TAGS_URL = MARKETS_URL + '/tags';
export const MARKETS_BY_SEARCH_URL = MARKETS_URL + '/search/';
export const MARKETS_BY_TAG_URL = MARKETS_URL + '/tag/';
export const MARKET_BY_ID_URL = MARKETS_URL + '/';


export const SWEETS_URL = BASE_URL + '/api/sweets';
export const SWEETS_TAGS_URL = SWEETS_URL + '/tags';
export const SWEETS_BY_SEARCH_URL = SWEETS_URL + '/search/';
export const SWEETS_BY_TAG_URL = SWEETS_URL + '/tag/';
export const SWEET_BY_ID_URL =SWEETS_URL + '/';

export const SUPERMARKETS_URL = BASE_URL + '/api/supermarkets';
export const SUPERMARKETS_TAGS_URL = SUPERMARKETS_URL + '/tags';
export const SUPERMARKETS_BY_SEARCH_URL = SUPERMARKETS_URL + '/search/';
export const SUPERMARKETS_BY_TAG_URL = SUPERMARKETS_URL + '/tag/';
export const SUPERMARKET_BY_ID_URL = SUPERMARKETS_URL + '/';


export const HAIRS_URL = BASE_URL + '/api/hairs';
export const HAIRS_TAGS_URL = HAIRS_URL + '/tags';
export const HAIRS_BY_SEARCH_URL = HAIRS_URL + '/search/';
export const HAIRS_BY_TAG_URL = HAIRS_URL + '/tag/';
export const HAIR_BY_ID_URL = HAIRS_URL + '/';



export const USER_LOGIN_URL = BASE_URL + '/api/users/login';
export const USER_REGISTER_URL = BASE_URL + '/api/users/register';


export const ORDERS_URL = BASE_URL + '/api/orders';
export const ORDER_CREATE_URL = ORDERS_URL + '/create';
export const ORDER_NEW_FOR_CURRENT_USER_URL = ORDERS_URL + '/newOrderForCurrentUser';
export const ORDER_PAY_URL = ORDERS_URL + '/pay';
export const ORDER_TRACK_URL = ORDERS_URL + '/track/';

