module.exports = {
  "description": "REACT CRM API Definition",
  "$schema": "http://json-schema.org/draft-04/hyper-schema",
  "type": ["object"],
  "id": "http://127.0.0.1:8001/public/schema.json",
  "links": [{"href": "http://127.0.0.1:8001", "rel": "self"}],
  "title": "REACT CRM API",
  "properties": {
    "applications": {"$ref": "#/definitions/applications"},
    "areas": {"$ref": "#/definitions/areas"},
    "banks": {"$ref": "#/definitions/banks"},
    "campaigns": {"$ref": "#/definitions/campaigns"},
    "carriers": {"$ref": "#/definitions/carriers"},
    "merchants": {"$ref": "#/definitions/merchants"},
    "offers": {"$ref": "#/definitions/offers"},
    "orders": {"$ref": "#/definitions/orders"},
    "products": {"$ref": "#/definitions/products"},
    "prospects": {"$ref": "#/definitions/prospects"},
    "roles": {"$ref": "#/definitions/roles"},
    "shippingOffers": {"$ref": "#/definitions/shippingOffers"},
    "stocks": {"$ref": "#/definitions/stocks"},
    "storehouses": {"$ref": "#/definitions/storehouses"},
    "subscriptions": {"$ref": "#/definitions/subscriptions"},
    "trackers": {"$ref": "#/definitions/trackers"},
    "upsells": {"$ref": "#/definitions/upsells"},
    "users": {"$ref": "#/definitions/users"}
  },
  "definitions": {
    "applications": {
      "$schema": "http://json-schema.org/draft-04/hyper-schema",
      "description": "An application is a client application which can access React CRM API",
      "definitions": {
        "uuid": {
          "description": "the unique identifier of the application",
          "example": "01234567-89ab-cdef-0123-456789abcdef",
          "format": "uuid",
          "readOnly": true,
          "type": ["string"]
        },
        "id": {
          "description": "the identifier of the application (legacy, use uuid instead)",
          "example": "4",
          "readOnly": true,
          "type": ["integer", "string"]
        },
        "createdAt": {
          "description": "the time when a record for that application was created",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "deletedAt": {
          "description": "the time when the application was removed from the merchant's catalog",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "updatedAt": {
          "description": "the time when the application reference was updated for the last time",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "apiKey": {
          "type": "string",
          "description": "the api key the application needs to authenticate itself to the API",
          "example": "alksdfjadsfasdflj"
        },
        "apiSecret": "string",
        "description": "the api secret the application needs to authenticate itself to the API"
      },
      "properties": {
        "uuid": {"$ref": "#/definitions/applications/definitions/uuid"},
        "id": {"$ref": "#/definitions/applications/definitions/id"},
        "createdAt": {"$ref": "#/definitions/applications/definitions/createdAt"},
        "updatedAt": {"$ref": "#/definitions/applications/definitions/updatedAt"},
        "deletedAt": {"$ref": "#/definitions/applications/definitions/deletedAt"},
        "apiKey": {"$ref": "#/definitions/applications/definitions/apiKey"},
        "apiSecret": {"$ref": "#/definitions/applications/definitions/apiSecret"}
      },
      "type": "object",
      "links": [{
        "authenticated": true,
        "description": "I get all application details",
        "href": "/applications",
        "method": "GET",
        "rel": "instances",
        "schema": {
          "type": "object",
          "properties": {
            "itemsByPage": {"type": ["integer", "string"], "minimum": 0},
            "offset": {"type": ["integer", "string"], "minimum": 0},
            "orderBy": {"type": "string"},
            "orderReverse": {"type": ["string", "boolean"]},
            "searchScope": {"type": "string"},
            "searchQuery": {"type": "string"}
          }
        },
        "targetSchema": {"type": "array", "items": {"$ref": "#/definitions/applications"}}
      }, {
        "authenticated": true,
        "description": "I get an application details",
        "href": "/application/{(%23%2Fdefinitions%2Fapplications%2Fdefinitions%2Fid)}",
        "method": "GET",
        "rel": "self",
        "schema": {
          "type": "object",
          "properties": {"id": {"$ref": "#/definitions/applications/definitions/id"}},
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/applications"}
      }, {
        "authenticated": true,
        "description": "I add a application",
        "href": "/applications",
        "method": "POST",
        "rel": "create",
        "targetSchema": {"$ref": "#/definitions/applications"}
      }, {
        "authenticated": true,
        "description": "I update a application",
        "href": "/applications/{(%23%2Fdefinitions%2Fapplications%2Fdefinitions%2Fid)}",
        "method": "PUT",
        "rel": "update",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/applications/definitions/id"},
            "apiKey": {"$ref": "#/definitions/applications/definitions/apiKey"},
            "apiSecret": {"$ref": "#/definitions/applications/definitions/apiSecret"}
          },
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/applications"}
      }, {
        "authenticated": true,
        "description": "I delete a application",
        "href": "/applications/{(%23%2Fdefinitions%2Fapplications%2Fdefinitions%2Fid)}",
        "method": "DELETE",
        "rel": "destroy",
        "schema": {
          "type": "object",
          "properties": {"id": {"$ref": "#/definitions/applications/definitions/id"}},
          "required": ["id"]
        }
      }, {
        "authenticated": false,
        "description": "I authenticate a application",
        "href": "/authenticateApplication",
        "method": "POST",
        "rel": "authenticate",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/applications/definitions/id"},
            "apiKey": {"$ref": "#/definitions/applications/definitions/apiKey"},
            "apiSecret": {"$ref": "#/definitions/applications/definitions/apiSecret"}
          },
          "required": ["apiKey", "apiSecret"]
        },
        "targetSchema": {
          "type": "object",
          "properties": {"token": {"type": "string"}, "campaign": {"$ref": "#/definitions/campaigns"}}
        }
      }]
    },
    "areas": {
      "$schema": "http://json-schema.org/draft-04/hyper-schema",
      "description": "definition of a country/area based on ISO definitions",
      "definitions": {
        "id": {
          "description": "the unique identifier of the area",
          "example": "01234567-89ab-cdef-0123-456789abcdef",
          "format": "uuid",
          "readOnly": true,
          "type": ["string"]
        },
        "createdAt": {
          "description": "the time when a record for that area was created",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "deletedAt": {
          "description": "the time when the area was removed from the merchant's catalog",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "updatedAt": {
          "description": "the time when the area reference was updated for the last time",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "title": {
          "description": "the name of the area, usually a country name",
          "example": "Belgium",
          "type": ["string"]
        },
        "alpha2Code": {
          "description": "the ISO alpha 2 code definition of the area",
          "type": "string",
          "minLength": 2,
          "maxLength": 2
        },
        "alpha3Code": {
          "description": "the ISO alpha 3 code definition of the area",
          "type": "string",
          "minLength": 3,
          "maxLength": 3
        }
      },
      "properties": {
        "id": {"$ref": "#/definitions/areas/definitions/id"},
        "createdAt": {"$ref": "#/definitions/areas/definitions/createdAt"},
        "updatedAt": {"$ref": "#/definitions/areas/definitions/updatedAt"},
        "deletedAt": {"$ref": "#/definitions/areas/definitions/deletedAt"},
        "title": {"$ref": "#/definitions/areas/definitions/title"},
        "alpha2Code": {"$ref": "#/definitions/areas/definitions/alpha2Code"},
        "alpha3Code": {"$ref": "#/definitions/areas/definitions/alpha3Code"}
      },
      "type": "object",
      "links": [{
        "authenticated": false,
        "description": "I get the areas",
        "href": "/areas",
        "method": "GET",
        "rel": "search",
        "schema": {"type": "object", "properties": {"title": {"$ref": "#/definitions/areas/definitions/title"}}},
        "targetSchema": {"type": "array", "items": {"$ref": "#/definitions/areas"}}
      }]
    },
    "banks": {
      "$schema": "http://json-schema.org/draft-04/hyper-schema",
      "description": "A payment gateway",
      "definitions": {
        "uuid": {
          "description": "the unique identifier of the gateway",
          "example": "01234567-89ab-cdef-0123-456789abcdef",
          "format": "uuid",
          "readOnly": true,
          "type": ["string"]
        },
        "id": {
          "description": "the identifier of the gateway (legacy, use uuid instead)",
          "example": "4",
          "readOnly": true,
          "type": ["integer", "string"]
        },
        "createdAt": {
          "description": "the time when a record for that gateway was created",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "deletedAt": {
          "description": "the time when the gateway was removed from the merchant's catalog",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "updatedAt": {
          "description": "the time when the gateway reference was updated for the last time",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "title": {
          "description": "A label given by the merchant to the gateway",
          "example": "Virtualmerchant high traffic",
          "type": ["string"]
        },
        "testMode": {
          "description": "a flag to define whether the gateway is in test mode",
          "type": ["boolean", "null"],
          "example": "true"
        },
        "type": {
          "description": "the provider for the gateway",
          "example": "Paypal",
          "type": "string",
          "enum": ["rocketgate", "virtualmerchant", "authorizenet", "payflow", "nmi"]
        },
        "authorizeNet": {
          "description": "AuthorizeNet gateway settings",
          "type": ["object", "null"],
          "properties": {"API_login_ID": {"type": "string"}, "transaction_key": {"type": "string"}},
          "required": ["API_login_ID", "transaction_key"]
        },
        "virtualMerchant": {
          "description": "Virtualmerchant gateway settings",
          "type": ["object", "null"],
          "properties": {
            "merchant_id": {"type": "string"},
            "user_id": {"type": "string"},
            "ssl_pin": {"type": "string"}
          },
          "required": ["merchant_id", "user_id", "ssl_pin"]
        },
        "payFlow": {
          "description": "Payflow gateway settings",
          "type": ["object", "null"],
          "properties": {
            "partner": {"type": "string"},
            "merchant_login": {"type": "string"},
            "password": {"type": "string"}
          },
          "required": ["password", "partner"]
        },
        "nmi": {
          "description": "NMI gateway settings",
          "type": ["object", "null"],
          "properties": {"username": {"type": "string"}, "password": {"type": "string"}},
          "required": ["username", "password"]
        },
        "rocketGate": {
          "description": "Rocketgate gateway settings",
          "type": ["object", "null"],
          "properties": {"merchant_id": {"type": "string"}, "merchant_password": {"type": "string"}},
          "required": ["merchant_id", "merchant_password"]
        }
      },
      "properties": {
        "uuid": {"$ref": "#/definitions/banks/definitions/uuid"},
        "id": {"$ref": "#/definitions/banks/definitions/id"},
        "createdAt": {"$ref": "#/definitions/banks/definitions/createdAt"},
        "updatedAt": {"$ref": "#/definitions/banks/definitions/updatedAt"},
        "deletedAt": {"$ref": "#/definitions/banks/definitions/deletedAt"},
        "title": {"$ref": "#/definitions/banks/definitions/title"},
        "testMode": {"$ref": "#/definitions/banks/definitions/testMode"},
        "type": {"$ref": "#/definitions/banks/definitions/type"},
        "authorizeNet": {"$ref": "#/definitions/banks/definitions/authorizeNet"},
        "virtualMerchant": {"$ref": "#/definitions/banks/definitions/virtualMerchant"},
        "payFlow": {"$ref": "#/definitions/banks/definitions/payFlow"},
        "nmi": {"$ref": "#/definitions/banks/definitions/nmi"},
        "rocketGate": {"$ref": "#/definitions/banks/definitions/rocketGate"}
      },
      "type": "object",
      "links": [{
        "authenticated": true,
        "description": "I get all bank details",
        "href": "/banks",
        "method": "GET",
        "rel": "instances",
        "schema": {
          "type": "object",
          "properties": {
            "itemsByPage": {"type": ["integer", "string"], "minimum": 0},
            "offset": {"type": ["integer", "string"], "minimum": 0},
            "orderBy": {"type": "string"},
            "orderReverse": {"type": ["string", "boolean"]},
            "searchScope": {"type": "string"},
            "searchQuery": {"type": "string"}
          }
        },
        "targetSchema": {
          "count": {"type": "integer", "minimum": 0},
          "rows": {"type": "array", "items": {"$ref": "#/definitions/banks"}},
          "type": "object"
        }
      }, {
        "authenticated": true,
        "description": "I get an bank details",
        "href": "/banks/{(%23%2Fdefinitions%banks%2Fdefinitions%2Fid)}",
        "method": "GET",
        "rel": "self",
        "schema": {
          "type": "object",
          "properties": {"id": {"$ref": "#/definitions/banks/definitions/id"}},
          "required": "id"
        },
        "targetSchema": {"$ref": "#/definitions/banks"}
      }, {
        "authenticated": true,
        "description": "get statistics for a particular gateway within a window of time"
      }, {
        "authenticated": true,
        "description": "I add a bank",
        "href": "/banks",
        "method": "POST",
        "rel": "create",
        "schema": {
          "type": "object",
          "properties": {
            "title": {"$ref": "#/definitions/banks/definitions/title"},
            "type": {"$ref": "#/definitions/banks/definitions/type"},
            "testMode": {"$ref": "#/definitions/banks/definitions/testMode"},
            "rocketGate": {"$ref": "#/definitions/banks/definitions/rocketGate"},
            "virtualMerchant": {"$ref": "#/definitions/banks/definitions/virtualMerchant"},
            "authorizeNet": {"$ref": "#/definitions/banks/definitions/authorizeNet"},
            "nmi": {"$ref": "#/definitions/banks/definitions/nmi"},
            "payFlow": {"$ref": "#/definitions/banks/definitions/payFlow"}
          },
          "required": ["type", "title"]
        },
        "targetSchema": {"$ref": "#/definitions/banks"}
      }, {
        "authenticated": true,
        "description": "I update a bank",
        "href": "/banks/{(%23%2Fdefinitions%2Fbanks%2Fdefinitions%2Fid)}",
        "method": "PUT",
        "rel": "update",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/banks/definitions/id"},
            "title": {"$ref": "#/definitions/banks/definitions/title"},
            "testMode": {"$ref": "#/definitions/banks/definitions/testMode"},
            "rocketGate": {"$ref": "#/definitions/banks/definitions/rocketGate"},
            "virtualMerchant": {"$ref": "#/definitions/banks/definitions/virtualMerchant"},
            "authorizeNet": {"$ref": "#/definitions/banks/definitions/authorizeNet"},
            "nmi": {"$ref": "#/definitions/banks/definitions/nmi"},
            "payFlow": {"$ref": "#/definitions/banks/definitions/payFlow"}
          },
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/banks"}
      }, {
        "authenticated": true,
        "description": "I delete a bank",
        "href": "/banks/{(%23%2Fdefinitions%2Fbanks%2Fdefinitions%2Fid)}",
        "method": "DELETE",
        "rel": "destroy",
        "schema": {
          "type": "object",
          "properties": {"id": {"$ref": "#/definitions/banks/definitions/id"}},
          "required": ["id"]
        }
      }]
    },
    "campaigns": {
      "$schema": "http://json-schema.org/draft-04/hyper-schema",
      "description": "A selling campaign definition",
      "definitions": {
        "uuid": {
          "description": "the unique identifier of the campaign",
          "example": "01234567-89ab-cdef-0123-456789abcdef",
          "format": "uuid",
          "readOnly": true,
          "type": ["string"]
        },
        "id": {
          "description": "the identifier of the campaign (legacy, use uuid instead)",
          "example": "4",
          "readOnly": true,
          "type": ["integer", "string"]
        },
        "createdAt": {
          "description": "the time when a record for that campaign was created",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "deletedAt": {
          "description": "the time when the campaign was removed from the merchant's catalog",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "updatedAt": {
          "description": "the time when the campaign reference was updated for the last time",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "title": {
          "description": "A label given by the merchant to the campaign",
          "example": "Eye perfect",
          "type": ["string"]
        },
        "type": {
          "description": "the type of the campaign",
          "type": "string",
          "example": "hosted-cms",
          "enum": ["self-hosted", "hosted-cart", "hosted-cms"]
        },
        "url": {
          "description": "The url to reach the campaign storefront",
          "example": "https//eye-perfect.secureapay.com",
          "type": "string",
          "format": "uri"
        },
        "visits": {"description": "the number of visits on the campaign storefront", "example": 666, "type": "integer"},
        "status": {
          "description": "the configuration status of the campaign storefront",
          "type": "string",
          "example": "ready",
          "enum": ["incomplete", "ready", "disabled"],
          "readOnly": true
        },
        "config": {
          "type": "object",
          "description": "the configuration definition of the campaign storefront",
          "example": "{}",
          "readOnly": true
        },
        "container": {"description": "I have no idea", "type": "object"}
      },
      "properties": {
        "uuid": {"$ref": "#/definitions/campaigns/definitions/uuid"},
        "id": {"$ref": "#/definitions/campaigns/definitions/id"},
        "createdAt": {"$ref": "#/definitions/campaigns/definitions/createdAt"},
        "updatedAt": {"$ref": "#/definitions/campaigns/definitions/updatedAt"},
        "deletedAt": {"$ref": "#/definitions/campaigns/definitions/deletedAt"},
        "title": {"$ref": "#/definitions/campaigns/definitions/title"},
        "type": {"$ref": "#/definitions/campaigns/definitions/type"},
        "url": {"$ref": "#/definitions/campaigns/definitions/url"},
        "visits": {"$ref": "#/definitions/campaigns/definitions/visits"},
        "status": {"$ref": "#/definitions/campaigns/definitions/status"},
        "config": {"$ref": "#/definitions/campaigns/definitions/config"},
        "container": {"$ref": "#/definitions/campaigns/definitions/container"},
        "offers": {"type": "array", "items": {"$ref": "#/definitions/offers"}},
        "banks": {"type": "array", "items": {"$ref": "#/definitions/banks"}},
        "shippingOffers": {"type": "array", "items": {"$ref": "#/definitions/shippingOffers"}},
        "trackers": {"type": "array", "items": {"$ref": "#/definitions/trackers"}}
      },
      "type": "object",
      "links": [{
        "authenticated": true,
        "description": "I get all campaign details",
        "href": "/campaigns",
        "method": "GET",
        "rel": "instances",
        "schema": {
          "type": "object",
          "properties": {
            "itemsByPage": {"type": ["integer", "string"], "minimum": 0},
            "offset": {"type": ["integer", "string"], "minimum": 0},
            "orderBy": {"type": "string"},
            "orderReverse": {"type": ["string", "boolean"]},
            "searchScope": {"type": "string"},
            "searchQuery": {"type": "string"}
          }
        },
        "targetSchema": {"type": "array", "items": {"$ref": "#/definitions/campaigns"}}
      }, {
        "authenticated": true,
        "description": "I get an campaign details",
        "href": "/campaigns/{(%23%2Fdefinitions%2Fcampaigns%2Fdefinitions%2Fid)}",
        "method": "GET",
        "rel": "self",
        "schema": {
          "type": "object",
          "properties": {"id": "#/definitions/campaigns/definitions/id"},
          "required": ["id"]
        },
        "targetSchema": {
          "allOf": {"$ref": "#/definitions/campaigns"},
          "properties": {
            "offers": {"type": "array", "items": {"$ref": "#/definitions/offers"}},
            "trackers": {"type": "array", "items": {"$ref": "#/definitions/trackers"}},
            "banks": {"type": "array", "items": {"$ref": "#/definitions/banks"}}
          }
        }
      }, {
        "authenticated": true,
        "description": "I add a campaign",
        "href": "/campaigns",
        "method": "POST",
        "rel": "create",
        "schema": {
          "type": "object",
          "properties": {
            "title": {"$ref": "#/definitions/campaigns/definitions/title"},
            "type": {"$ref": "#/definitions/campaigns/definitions/type"},
            "url": "#/definitions/campaigns/definitions/url"
          },
          "required": ["title", "type"]
        },
        "targetSchema": {"$ref": "#/definitions/campaigns"}
      }, {
        "authenticated": true,
        "description": "get offers attached to a given campaign",
        "href": "/campaigns/{(%23%2Fdefinitions%2Fcampaigns%2Fdefinitions%2Fid)}/offers",
        "method": "GET",
        "rel": "offers",
        "schema": {
          "type": "object",
          "properties": {"id": {"$ref": "#/definitions/campaigns/definitions/id"}},
          "required": ["id"]
        },
        "targetSchema": {"type": "array", "items": {"$ref": "#/definitions/offers"}}
      }, {
        "authenticated": true,
        "description": "I add a offers to a campaign",
        "href": "/campaigns/{(%23%2Fdefinitions%2Fcampaigns%2Fdefinitions%2Fid)}/offers",
        "method": "POST",
        "rel": "set offers",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/campaigns/definitions/id"},
            "offersIds": {"type": "array", "items": {"$ref": "#/definitions/offers/definitions/id"}}
          },
          "required": ["id", "offersIds"]
        },
        "targetSchema": {"$ref": "#/definitions/campaigns"}
      }, {
        "authenticated": true,
        "description": "I add a bunch of shipping offers to a campaign",
        "href": "/campaigns/{(%23%2Fdefinitions%2Fcampaigns%2Fdefinitions%2Fid)}/shippingoffers",
        "method": "POST",
        "rel": "set shipping offers",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/campaigns/definitions/id"},
            "shippingOffersIds": {"type": "array", "items": {"$ref": "#/definitions/shippingOffers/definitions/id"}}
          },
          "required": ["id", "shippingOffersIds"]
        },
        "targetSchema": {"$ref": "#/definitions/campaigns"}
      }, {
        "authenticated": true,
        "description": "I add banks to a campaign",
        "href": "/campaigns/{(%23%2Fdefinitions%2Fcampaigns%2Fdefinitions%2Fid)}/banks",
        "method": "POST",
        "rel": "set banks",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/campaigns/definitions/id"},
            "banksIds": {"type": "array", "items": {"$ref": "#/definitions/banks/definitions/id"}}
          },
          "required": ["id", "banksIds"]
        },
        "targetSchema": {"$ref": "#/definitions/campaigns"}
      }, {
        "authenticated": true,
        "description": "I add a trackers to a campaign",
        "href": "/campaigns/{(%23%2Fdefinitions%2Fcampaigns%2Fdefinitions%2Fid)}/trackers",
        "method": "POST",
        "rel": "set trackers",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/campaigns/definitions/id"},
            "trackersIds": {"type": "array", "items": {"$ref": "#/definitions/trackers/definitions/id"}}
          },
          "required": ["id", "trackersIds"]
        },
        "targetSchema": {"$ref": "#/definitions/campaigns"}
      }, {
        "authenticated": true,
        "description": "I update a campaign config",
        "href": "/campaigns/{(%23%2Fdefinitions%2Fcampaigns%2Fdefinitions%2Fid)}/config",
        "method": "PUT",
        "rel": "update config",
        "schema": {
          "type": "object",
          "properties": {
            "id": "#/definitions/campaigns/definitions/id",
            "config": "#/definitions/campaigns/definitions/config"
          },
          "required": ["id", "config"]
        },
        "targetSchema": {"$ref": "#/definitions/campaigns"}
      }, {
        "authenticated": true,
        "description": "I update a campaign",
        "href": "/campaigns/{(%23%2Fdefinitions%2Fcampaigns%2Fdefinitions%2Fid)}",
        "method": "PUT",
        "rel": "update",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/campaigns/definitions/id"},
            "visits": {"$ref": "#/definitions/campaigns/definitions/visits"},
            "type": {"$ref": "#/definitions/campaigns/definitions/type"}
          },
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/campaigns"}
      }, {
        "authenticated": true,
        "description": "I delete a campaign",
        "href": "/campaigns/{(%23%2Fdefinitions%2Fcampaigns%2Fdefinitions%2Fid)}",
        "method": "DELETE",
        "rel": "destroy",
        "schema": {
          "type": "object",
          "properties": {"id": {"$ref": "#/definitions/campaigns/definitions/id"}},
          "required": ["id"]
        }
      }, {
        "authenticated": true,
        "description": "I create a container",
        "href": "/campaigns/{(%23%2Fdefinitions%2Fcampaigns%2Fdefinitions%2Fid)}/container/create",
        "method": "POST",
        "rel": "create container",
        "targetSchema": {"$ref": {}}
      }, {
        "authenticated": true,
        "description": "I start a container",
        "href": "/campaigns/{(%23%2Fdefinitions%2Fcampaigns%2Fdefinitions%2Fid)}/container/start",
        "method": "POST",
        "rel": "start container",
        "targetSchema": {"$ref": {}}
      }, {
        "authenticated": true,
        "description": "I kill a container",
        "href": "/campaigns/{(%23%2Fdefinitions%2Fcampaigns%2Fdefinitions%2Fid)}/container/kill",
        "method": "POST",
        "rel": "kill container",
        "targetSchema": {"$ref": {}}
      }, {
        "authenticated": true,
        "description": "I restart a container",
        "href": "/campaigns/{(%23%2Fdefinitions%2Fcampaigns%2Fdefinitions%2Fid)}/container/restart",
        "method": "POST",
        "rel": "restart container",
        "targetSchema": {"$ref": {}}
      }, {
        "authenticated": true,
        "description": "I remove a container",
        "href": "/campaigns/{(%23%2Fdefinitions%2Fcampaigns%2Fdefinitions%2Fid)}/container/remove",
        "method": "POST",
        "rel": "remove container",
        "targetSchema": {"$ref": {}}
      }]
    },
    "carriers": {
      "$schema": "http://json-schema.org/draft-04/hyper-schema",
      "description": "A carrier used for shipment",
      "definitions": {
        "id": {
          "description": "the unique identifier of the carrier",
          "example": "01234567-89ab-cdef-0123-456789abcdef",
          "format": "uuid",
          "readOnly": true,
          "type": ["string"]
        },
        "createdAt": {
          "description": "the time when a record for that carrier was created",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "deletedAt": {
          "description": "the time when the carrier was removed from the merchant's catalog",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "updatedAt": {
          "description": "the time when the carrier reference was updated for the last time",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "title": {
          "description": "the human readable label for the carrier",
          "example": "UPS with shipwire",
          "type": ["string"]
        },
        "credentials": {
          "description": "the credentials requested for third party delivery/fulfillment system integration",
          "example": "{username:'blah', password:'secret'}",
          "type": ["null", "object"]
        },
        "level": {
          "description": "the service level of the specific carrier",
          "example": "fast delivery",
          "type": "string"
        },
        "shippingProvider": {
          "description": "the provider used for shipping automation",
          "example": "shipwire",
          "type": "string",
          "enum": ["manual", "shipwire", "linnworks", "postmaster", "amazon"]
        },
        "shippingCost": {
          "description": "estimated cost of delivery for a given area",
          "type": "object",
          "properties": {
            "country": {"$ref": "#/definitions/areas"},
            "amount": {"type": ["number", "string"], "description": "the estimated cost (in USD) of an item delivery"}
          }
        }
      },
      "properties": {
        "id": {"$ref": "#/definitions/carriers/definitions/id"},
        "createdAt": {"$ref": "#/definitions/carriers/definitions/createdAt"},
        "updatedAt": {"$ref": "#/definitions/carriers/definitions/updatedAt"},
        "deletedAt": {"$ref": "#/definitions/carriers/definitions/deletedAt"},
        "title": {"$ref": "#/definitions/carriers/definitions/title"},
        "credentials": {"$ref": "#/definitions/carriers/definitions/credentials"},
        "level": {"$ref": "#/definitions/carriers/definitions/level"},
        "shippingProvider": {"$ref": "#/definitions/carriers/definitions/shippingProvider"},
        "shippingCosts": {"type": "array", "item": {"$ref": "#/definitions/carriers/definitions/shippingCost"}}
      },
      "type": "object",
      "links": [{
        "authenticated": true,
        "description": "I get the carriers",
        "href": "/carriers",
        "method": "GET",
        "rel": "instances",
        "schema": {
          "type": "object",
          "properties": {
            "itemsByPage": {"type": ["integer", "string"], "minimum": 0},
            "offset": {"type": ["integer", "string"], "minimum": 0},
            "orderBy": {"type": "string"},
            "orderReverse": {"type": ["string", "boolean"]},
            "searchScope": {"type": "string"},
            "searchQuery": {"type": "string"}
          }
        },
        "targetSchema": {
          "type": "object",
          "properties": {
            "count": {"type": "integer", "minimum": 0},
            "rows": {"type": "array", "items": {"$ref": "#/definitions/carriers"}}
          }
        }
      }, {
        "authenticated": true,
        "description": "add a carrier",
        "href": "/carriers",
        "method": "POST",
        "rel": "create",
        "schema": {
          "type": "object",
          "properties": {
            "title": {"$ref": "#/definitions/carriers/definitions/title"},
            "credentials": {"$ref": "#/definitions/carriers/definitions/credentials"},
            "shippingProvider": {"$ref": "#/definitions/carriers/definitions/shippingProvider"},
            "level": {"$ref": "#/definitions/carriers/definitions/level"},
            "shippingCosts": {"type": "array", "items": {"$ref": "#/definitions/carriers/definitions/shippingCost"}}
          },
          "required": ["title", "level"]
        },
        "targetSchema": {"$ref": "#/definitions/carriers"}
      }, {
        "authenticated": true,
        "description": "I get a specific carrier",
        "href": "/carriers/{(%23%2Fdefinitions%2Fcarriers%2Fdefinitions%2Fid)}",
        "method": "GET",
        "rel": "self",
        "schema": {
          "type": "object",
          "properties": {"id": {"$ref": "#/definitions/carriers/definitions/id"}},
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/carriers"}
      }, {
        "authenticated": true,
        "description": "I update a carrier",
        "href": "/carriers/{(%23%2Fdefinitions%2Fcarriers%2Fdefinitions%2Fid)}",
        "method": "PUT",
        "rel": "update",
        "schema": {
          "type": "object",
          "properties": {
            "title": {"$ref": "#/definitions/carriers/definitions/title"},
            "credentials": {"$ref": "#/definitions/carriers/definitions/credentials"},
            "level": {"$ref": "#/definitions/carriers/definitions/level"},
            "shippingCosts": {"type": "array", "items": {"$ref": "#/definitions/carriers/definitions/shippingCost"}},
            "id": {"$ref": "#/definitions/carriers/definitions/id"}
          },
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/carriers"}
      }, {
        "authenticated": true,
        "description": "delete a carrier",
        "href": "/carriers/{(%23%2Fdefinitions%2Fcarriers%2Fdefinitions%2Fid)}",
        "method": "DELETE",
        "rel": "destroy",
        "schema": {
          "type": "object",
          "properties": {"id": {"$ref": "#/definitions/carriers/definitions/id"}},
          "required": ["id"]
        }
      }]
    },
    "merchants": {
      "$schema": "http://json-schema.org/draft-04/hyper-schema",
      "description": "A merchant is a virtual entity that represent a group of 1 or more people using our application",
      "definitions": {
        "uuid": {
          "description": "the unique identifier of the merchant",
          "example": "01234567-89ab-cdef-0123-456789abcdef",
          "format": "uuid",
          "readOnly": true,
          "type": ["string"]
        },
        "id": {
          "description": "the identifier of the merchant (legacy, use uuid instead)",
          "example": "4",
          "readOnly": true,
          "type": ["integer", "string"]
        },
        "createdAt": {
          "description": "the time the merchant group was created",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "deletedAt": {
          "description": "the time when the merchant group was removed",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "updatedAt": {
          "description": "the time when the merchant group attributes were updated for the last time",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "name": {
          "description": "the name of the merchant group as displayed within the application",
          "example": "Zudker",
          "type": ["string"]
        },
        "companyName": {
          "description": "the name of the company used for facing customers",
          "example": "Tantrum Medical LLC",
          "type": "string"
        },
        "email": {
          "description": "the email the company should be reached at by customers",
          "example": "contact@tantrumllc.com",
          "type": "string"
        },
        "phone": {
          "description": "the phone number where the company can be reached by customers",
          "example": "096-661-97879",
          "type": "string"
        },
        "logo": {
          "description": "the logo used to represent visually the company in the recipes and such",
          "example": "http://link.to/logo.jpg",
          "type": "string"
        }
      },
      "properties": {
        "uuid": {"$ref": "#/definitions/merchants/definitions/uuid"},
        "id": {"$ref": "#/definitions/merchants/definitions/id"},
        "createdAt": {"$ref": "#/definitions/merchants/definitions/createdAt"},
        "updatedAt": {"$ref": "#/definitions/merchants/definitions/updatedAt"},
        "deletedAt": {"$ref": "#/definitions/merchants/definitions/deletedAt"},
        "name": {"$ref": "#/definitions/merchants/definitions/name"},
        "companyName": {"$ref": "#/definitions/merchants/definitions/companyName"},
        "email": {"$ref": "#/definitions/merchants/definitions/email"},
        "phone": {"$ref": "#/definitions/merchants/definitions/phone"},
        "logo": {"$ref": "#/definitions/merchants/definitions/logo"}
      },
      "type": "object",
      "links": [{
        "authenticated": true,
        "description": "I get all merchant details",
        "href": "/merchants",
        "method": "GET",
        "rel": "instances",
        "schema": {
          "type": "object",
          "properties": {
            "itemsByPage": {"type": ["integer", "string"], "minimum": 0},
            "offset": {"type": ["integer", "string"], "minimum": 0},
            "orderBy": {"type": "string"},
            "orderReverse": {"type": ["string", "boolean"]},
            "searchScope": {"type": "string"},
            "searchQuery": {"type": "string"}
          }
        },
        "targetSchema": {"type": "array", "items": {"$ref": "#/definitions/merchants"}}
      }, {
        "authenticated": true,
        "description": "I get an merchant details",
        "href": "/merchants/{(%23%2Fdefinitions%2Fmerchants%2Fdefinitions%2Fid)}",
        "method": "GET",
        "rel": "self",
        "schema": {
          "type": "object",
          "properties": {"uuid": {"$ref": "#/definitions/merchants/definitions/uuid"}},
          "required": ["uuid"]
        },
        "targetSchema": {"$ref": "#/definitions/merchants"}
      }, {"authenticated": true, "description": "I add a merchant"}, {
        "authenticated": true,
        "description": "I update a merchant",
        "href": "/merchants/{(%23%2Fdefinitions%2Fmerchants%2Fdefinitions%2Fid)}",
        "method": "PUT",
        "rel": "update",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/merchants/definitions/id"},
            "name": {"$ref": "#/definitions/merchants/definitions/name"},
            "companyName": {"$ref": "#/definitions/merchants/definitions/companyName"},
            "phone": {},
            "email": {},
            "address": {},
            "logo": {}
          },
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/merchants"}
      }, {"authenticated": true, "description": "I delete a merchant"}]
    },
    "offers": {
      "$schema": "http://json-schema.org/draft-04/hyper-schema",
      "description": "an offer is a bundle of products to be sold under given conditions",
      "definitions": {
        "uuid": {
          "description": "the unique identifier of the offer",
          "example": "01234567-89ab-cdef-0123-456789abcdef",
          "format": "uuid",
          "readOnly": true,
          "type": ["string"]
        },
        "id": {
          "description": "the identifier of the offer (legacy, use uuid instead)",
          "example": "4",
          "readOnly": true,
          "type": ["integer", "string"]
        },
        "createdAt": {
          "description": "the time when a record for that offer was created",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "deletedAt": {
          "description": "the time when the offer was removed from the merchant's offers collection",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string", "null"]
        },
        "updatedAt": {
          "description": "the time when the offer was updated for the last time",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "title": {"description": "the human readable label for the offer", "example": "Super deal", "type": ["string"]},
        "description": {
          "description": "a description of the offer",
          "example": "this is a super deal",
          "type": ["string"]
        },
        "quantity": {
          "description": "the number of product in the offer",
          "example": 3,
          "minimum": 1,
          "type": ["integer", "string"]
        },
        "currency": {
          "description": "the currency associated to the product price",
          "example": "USD",
          "type": ["string"]
        },
        "pricePerUnit": {
          "description": "the price of one product item in the offer",
          "example": 3.99,
          "type": ["number", "string"]
        },
        "recurringPlan": {
          "description": "the recurring definition of a subscription offer",
          "type": ["object", "null"],
          "definitions": {
            "uuid": {
              "description": "the unique identifier of the recurring plan",
              "example": "01234567-89ab-cdef-0123-456789abcdef",
              "format": "uuid",
              "readOnly": true,
              "type": ["string"]
            },
            "id": {
              "description": "the identifier of the recurring plan (legacy, use uuid instead)",
              "example": "4",
              "readOnly": true,
              "type": ["integer", "string"]
            },
            "iterationCount": {
              "description": "the number of occurrences the recursive payment will happen",
              "example": 12,
              "type": ["integer", "string"]
            },
            "intervalUnit": {
              "description": "the time unit to be associated with intervalLength to determine the time between two occurrences",
              "example": "days",
              "enum": ["minutes", "hours", "days", "weeks", "months"],
              "type": "string"
            },
            "amount": {
              "description": "the amount to be billed on each iteration",
              "example": 12.99,
              "type": ["number", "string"]
            },
            "currency": {"description": "the currency associated to each payment", "example": "USD", "type": "string"},
            "type": {
              "description": "the subscription plan type",
              "example": "subscriptionPlan",
              "enum": ["subscriptionPlan", "fundingPlan"]
            }
          },
          "properties": {
            "uuid": {"$ref": "#/definitions/offers/definitions/recurringPlan/definitions/uuid"},
            "id": {"$ref": "#/definitions/offers/definitions/recurringPlan/definitions/id"},
            "iterationCount": {"$ref": "#/definitions/offers/definitions/recurringPlan/definitions/iterationCount"},
            "intervalUnit": {"$ref": "#/definitions/offers/definitions/recurringPlan/definitions/intervalUnit"},
            "amount": {"$ref": "#/definitions/offers/definitions/recurringPlan/definitions/amount"},
            "currency": {"$ref": "#/definitions/offers/definitions/recurringPlan/definitions/currency"},
            "type": {"$ref": "#/definitions/offers/definitions/recurringPlan/definitions/type"}
          },
          "required": ["iterationCount", "intervalLength", "intervalUnit", "amount", "currency", "type"]
        }
      },
      "properties": {
        "uuid": {"$ref": "#/definitions/offers/definitions/uuid"},
        "id": {"$ref": "#/definitions/offers/definitions/id"},
        "createdAt": {"$ref": "#/definitions/offers/definitions/createdAt"},
        "updatedAt": {"$ref": "#/definitions/offers/definitions/updatedAt"},
        "deletedAt": {"$ref": "#/definitions/offers/definitions/deletedAt"},
        "title": {"$ref": "#/definitions/offers/definitions/title"},
        "pricePerUnit": {"$ref": "#/definitions/offers/definitions/pricePerUnit"},
        "currency": {"$ref": "#/definitions/offers/definitions/currency"},
        "quantity": {"$ref": "#/definitions/offers/definitions/quantity"},
        "description": {"$ref": "#/definitions/offers/definitions/description"},
        "recurringPlan": {"$ref": "#/definitions/offers/definitions/recurringPlan"},
        "product": {"$ref": "#/definitions/products"}
      },
      "type": "object",
      "links": [{
        "authenticated": true,
        "description": "get a list of offers",
        "href": "/offers",
        "method": "GET",
        "rel": "instances",
        "schema": {
          "type": "object",
          "properties": {
            "itemsByPage": {"type": ["integer", "string"], "minimum": 0},
            "offset": {"type": ["integer", "string"], "minimum": 0},
            "orderBy": {"type": "string"},
            "orderReverse": {"type": ["string", "boolean"]},
            "searchScope": {"type": "string"},
            "searchQuery": {"type": "string"},
            "include": {
              "description": "the related resource to include",
              "type": ["array"],
              "items": {"type": "string", "enum": ["product"]}
            }
          }
        },
        "targetSchema": {
          "count": {"type": "integer", "minimum": 0},
          "rows": {"type": "array", "items": {"$ref": "#/definitions/offers"}},
          "type": "object"
        }
      }, {
        "authenticated": true,
        "description": "I get an offer details",
        "href": "/offers/{(%23%2Fdefinitions%2Foffers%2Fdefinitions%2Fid)}",
        "method": "GET",
        "rel": "self",
        "schema": {
          "properties": {
            "id": {"$ref": "#/definitions/offers/definitions/id"},
            "include": {
              "description": "the related resource to include",
              "type": ["array"],
              "items": {"type": "string", "enum": ["product"]}
            }
          }, "type": "object", "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/offers"}
      }, {"authenticated": false, "description": "I upload an offer picture to cloudinary"}, {
        "authenticated": true,
        "description": "create a new offer",
        "href": "/offers",
        "method": "POST",
        "rel": "create",
        "schema": {
          "properties": {
            "title": {"$ref": "#/definitions/offers/definitions/title"},
            "description": {"$ref": "#/definitions/offers/definitions/description"},
            "productId": {"$ref": "#/definitions/products/definitions/id"},
            "currency": {"$ref": "#/definitions/offers/definitions/currency"},
            "picture": {"type": ["object", "null"]},
            "recurringPlan": {"$ref": "#/definitions/offers/definitions/recurringPlan"},
            "pricePerUnit": {"$ref": "#/definitions/offers/definitions/pricePerUnit"},
            "quantity": {"$ref": "#/definitions/offers/definitions/quantity"}
          }, "type": "object", "required": ["title", "description", "productId", "currency"]
        },
        "targetSchema": {"$ref": "#/definitions/offers"}
      }, {
        "authenticated": true,
        "description": "I update a offer",
        "href": "/offers/{(%23%2Fdefinitions%2Foffers%2Fdefinitions%2Fid)}",
        "method": "PUT",
        "rel": "update",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/offers/definitions/id"},
            "title": {"$ref": "#/definitions/offers/definitions/title"},
            "description": {"$ref": "#/definitions/offers/definitions/description"},
            "picture": {"type": ["object", "null"]}
          },
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/offers"}
      }, {
        "authenticated": true,
        "description": "I delete a offer",
        "href": "/offers/{(%23%2Fdefinitions%2Foffers%2Fdefinitions%2Fid)}",
        "method": "DELETE",
        "rel": "destroy",
        "schema": {
          "properties": {"id": {"$ref": "#/definitions/offers/definitions/id"}},
          "required": ["id"],
          "type": "object"
        }
      }]
    },
    "orders": {
      "$schema": "http://json-schema.org/draft-04/hyper-schema",
      "description": "an order gather all the information related to a transaction",
      "definitions": {
        "uuid": {
          "description": "the unique identifier of the order",
          "example": "01234567-89ab-cdef-0123-456789abcdef",
          "format": "uuid",
          "readOnly": true,
          "type": ["string"]
        },
        "id": {
          "description": "the identifier of the order (legacy, use uuid instead)",
          "example": "4",
          "readOnly": true,
          "type": ["integer", "string"]
        },
        "createdAt": {
          "description": "the time when a record for that order was created",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "deletedAt": {
          "description": "the time when the order was removed from the merchant's orders collection",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string", "null"]
        },
        "updatedAt": {
          "description": "the time when the order was updated for the last time",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "ip_address": {
          "description": "the ip_address of the customer (todo: ?)",
          "example": "127.0.0.1",
          "type": "string",
          "format": ["ipv4", "ipv6"]
        },
        "referer": {"type": "string", "example": "(todo:)", "description": "(todo:)"},
        "gateway_response": {
          "description": "the raw response from one of the supported third party payment gateway service",
          "type": ["string", "object"],
          "example": "transaction successful"
        },
        "transaction_id": {
          "type": "string",
          "description": "the reference id in a third party payment gateway service system",
          "example": "1234"
        },
        "original_amount": {
          "description": "the amount of the transaction before currency conversion",
          "type": "string",
          "example": "12"
        },
        "converted_amount": {
          "description": "the amount of the transaction converted into USD",
          "type": "string",
          "example": "12"
        },
        "channels": {
          "description": "the definition of the channels the transaction was made through",
          "type": ["object", "string", "array", "null"],
          "example": "todo: "
        },
        "billing_status": {
          "description": "the status of payment operation",
          "example": "completed",
          "type": "string",
          "enum": ["completed", "pending", "failed", "cancelled", "refunded", "voided"]
        },
        "shippingOrder": {
          "description": "A shipping order is a record reference when an order has been into the shipping process",
          "type": "object",
          "definitions": {
            "id": {
              "description": "the unique identifier of the shipping order",
              "example": "01234567-89ab-cdef-0123-456789abcdef",
              "format": "uuid",
              "readOnly": true,
              "type": ["string"]
            },
            "createdAt": {
              "description": "the time when a record for that shipping order was created",
              "example": "2012-01-01T12:00:00Z",
              "format": "date-time",
              "readOnly": true,
              "type": ["string"]
            },
            "deletedAt": {
              "description": "the time when the order was removed from the merchant's shipping order collection",
              "example": "2012-01-01T12:00:00Z",
              "format": "date-time",
              "readOnly": true,
              "type": ["string", "null"]
            },
            "updatedAt": {
              "description": "the time when the shipping order was updated for the last time",
              "example": "2012-01-01T12:00:00Z",
              "format": "date-time",
              "readOnly": true,
              "type": ["string"]
            },
            "status": {
              "description": "the status of the shipping order",
              "example": "delivered",
              "type": ["string", "null"]
            },
            "order_id": {
              "description": "the id of the order in a third party fulfillment service",
              "example": "1234",
              "type": "string"
            },
            "rawResponse": {
              "type": ["string", "object"],
              "description": "the raw response from the third party fulfillment service",
              "example": "blah blah (todo)"
            },
            "trackingCode": {
              "description": "the tracking code provided by the fulfillment service",
              "example": "1234",
              "type": "string"
            }
          },
          "properties": {
            "id": {"$ref": "#/definitions/orders/definitions/shippingOrder/definitions/id"},
            "createdAt": {"$ref": "#/definitions/orders/definitions/shippingOrder/definitions/createdAt"},
            "updatedAt": {"$ref": "#/definitions/orders/definitions/shippingOrder/definitions/updatedAt"},
            "status": {"$ref": "#/definitions/orders/definitions/shippingOrder/definitions/status"},
            "order_id": {"$ref": "#/definitions/orders/definitions/shippingOrder/definitions/order_id"},
            "rawResponse": {"$ref": "#/definitions/orders/definitions/shippingOrder/definitions/rawResponse"},
            "trackingCode": {"$ref": "#/definitions/orders/definitions/shippingOrder/definitions/trackingCode"}
          }
        }
      },
      "properties": {
        "uuid": {"$ref": "#/definitions/orders/definitions/uuid"},
        "id": {"$ref": "#/definitions/orders/definitions/id"},
        "createdAt": {"$ref": "#/definitions/orders/definitions/createdAt"},
        "updatedAt": {"$ref": "#/definitions/orders/definitions/updatedAt"},
        "deletedAt": {"$ref": "#/definitions/orders/definitions/deletedAt"},
        "ip_address": {"$ref": "#/definitions/orders/definitions/ip_address"},
        "referer": {"$ref": "#/definitions/orders/definitions/referer"},
        "gateway_response": {"$ref": "#/definitions/orders/definitions/gateway_response"},
        "transaction_id": {"$ref": "#/definitions/orders/definitions/transaction_id"},
        "original_amount": {"$ref": "#/definitions/orders/definitions/original_amount"},
        "converted_amount": {"$ref": "#/definitions/orders/definitions/converted_amount"},
        "channels": {"$ref": "#/definitions/orders/definitions/channels"},
        "billing_status": {"$ref": "#/definitions/orders/definitions/billing_status"},
        "campaign": {"$ref": "#/definitions/campaigns"},
        "offer": {"$ref": "#/definitions/offers"},
        "prospect": {"$ref": "#/definitions/prospects"},
        "product": {"$ref": "#/definitions/products"},
        "bank": {"$ref": "#/definitions/campaigns"},
        "creditcard": {"$ref": "#/definitions/prospects/definitions/creditCard"},
        "BillingAddress": {"$ref": "#/definitions/prospects/definitions/address"},
        "ShippingAddress": {"$ref": "#/definitions/prospects/definitions/address"},
        "notes": {"type": "array", "items": {"$ref": "#/definitions/prospects/definitions/notes"}},
        "shippingOrder": {"$ref": "#/definitions/orders/definitions/shippingOrder"},
        "shippingOffer": {"$ref": "#/definitions/shippingOffers"},
        "subscription": {"$ref": "#/definitions/subscriptions"},
        "upsell": {}
      },
      "type": "object",
      "links": [{
        "authenticated": true,
        "description": "I get all order details",
        "href": "/orders",
        "method": "GET",
        "rel": "instances",
        "schema": {
          "type": "object",
          "properties": {
            "to": {"type": ["string", "integer"]},
            "from": {"type": ["string", "integer"]},
            "prospect": {"$ref": "#/definitions/prospects/definitions/id"},
            "subscription": {"type": "string"},
            "itemsByPage": {"type": ["integer", "string"], "minimum": 0},
            "offset": {"type": ["integer", "string"], "minimum": 0},
            "orderBy": {"type": "string"},
            "orderReverse": {"type": ["string", "boolean"]},
            "searchScope": {"type": "string"},
            "searchQuery": {"type": "string"},
            "include": {
              "description": "the related resource to include",
              "type": ["array"],
              "items": {
                "type": "string",
                "enum": ["campaign", "offer", "prospect", "product", "bank", "shipper", "subscription", "creditcard", "note", "shippingOrder", "shippingOffer", "upsell"]
              }
            }
          }
        },
        "targetSchema": {"type": "array", "items": {"$ref": "#/definitions/orders"}}
      }, {
        "authenticated": true,
        "description": "I get an order details",
        "href": "/orders/{(%23%2Fdefinitions%2Forders%2Fdefinitions%2Fuuid)}",
        "method": "GET",
        "rel": "self",
        "schema": {
          "type": "object",
          "properties": {"uuid": {"$ref": "#/definitions/orders/definitions/uuid"}},
          "required": ["uuid"]
        },
        "targetSchema": {"$ref": "#/definitions/orders"}
      }, {
        "authenticated": true,
        "description": "I get a order notes",
        "href": "/orders/{(%23%2Fdefinitions%2Forders%2Fdefinitions%2Fid)}/notes",
        "method": "GET",
        "rel": "notes",
        "schema": {
          "type": "object",
          "properties": {"id": {"$ref": "#/definitions/orders/definitions/id"}},
          "required": ["id"]
        },
        "targetSchema": {"type": "array", "items": {"$ref": "#/definitions/prospects/definitions/note"}}
      }, {
        "authenticated": true,
        "description": "I add a order",
        "href": "/orders",
        "method": "POST",
        "rel": "create",
        "schema": {
          "type": "object",
          "properties": {
            "gateway_id": {"$ref": "#/definitions/banks/definitions/id"},
            "campaign_id": {"$ref": "#/definitions/campaigns/definitions/id"},
            "prospect_id": {"$ref": "#/definitions/prospects/definitions/id"},
            "offer_id": {"$ref": "#/definitions/offers/definitions/id"},
            "shippingOfferId": {"$ref": "#/definitions/shippingOffers/definitions/id"},
            "billing_status": {"$ref": "#/definitions/orders/definitions/billing_status"},
            "creditcard": {"$ref": "#/definitions/prospects/definitions/creditCard"},
            "original_amount": {"$ref": "#/definitions/orders/definitions/original_amount"},
            "converted_amount": {"$ref": "#/definitions/orders/definitions/converted_amount"},
            "gateway_response": {"$ref": "#/definitions/orders/definitions/gateway_response"},
            "ip_address": {"$ref": "#/definitions/orders/definitions/ip_address"},
            "transaction_id": {"$ref": "#/definitions/orders/definitions/transaction_id"},
            "referer": {"$ref": "#/definitions/orders/definitions/referer"},
            "channels": {"$ref": "#/definitions/orders/definitions/channels"},
            "upsells": {}
          },
          "required": ["gateway_id", "campaign_id", "prospect_id", "shippingOfferId", "offer_id", "billing_status", "creditcard", "original_amount", "converted_amount"]
        },
        "targetSchema": {"$ref": "#/definitions/orders"}
      }, {
        "authenticated": true,
        "description": "I add a order note",
        "href": "/orders/{(%23%2Fdefinitions%2Forders%2Fdefinitions%2Fid)}/notes",
        "method": "POST",
        "rel": "add note",
        "schema": {
          "type": "object",
          "properties": {
            "order_id": {"$ref": "#/definitions/orders/definitions/id"},
            "message": {"$ref": "#/definitions/prospects/definitions/note/definitions/message"},
            "author_id": {"type": ["string", "integer"]}
          },
          "required": ["order_id", "message", "author_id"]
        },
        "targetSchema": {"$ref": "#/definitions/prospects/definitions/note"}
      }, {
        "authenticated": true,
        "description": "refund a given order",
        "href": "/orders/{(%23%2Fdefinitions%2Forders%2Fdefinitions%2Fid)}/refund",
        "method": "POST",
        "rel": "refund",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/orders/definitions/id"},
            "cancelShipping": {"type": ["boolean", "string"]},
            "required": ["id"]
          }
        },
        "targetSchema": {"$ref": "#/definitions/orders"}
      }, {
        "authenticated": true,
        "description": "refund a bunch of orders",
        "href": "/orders/refund",
        "method": "POST",
        "rel": "batch refund",
        "schema": {
          "type": "object",
          "properties": {
            "ids": {"type": "array", "items": {"$ref": "#/definitions/orders/definitions/id"}},
            "cancelShipping": {"type": ["boolean", "string"]},
            "required": ["ids"]
          }
        },
        "targetSchema": {
          "type": "array",
          "items": {
            "id": {"$ref": "#/definitions/orders/definitions/id"},
            "status": {"type": "string", "enum": ["success", "error"]},
            "billing_status": {"$ref": "#/definitions/orders/definitions/billing_status"},
            "shipping_status": {"type": ["string", "null"]}
          }
        }
      }, {
        "authenticated": true,
        "description": "void a bunch of transactions",
        "href": "/orders/void",
        "method": "POST",
        "rel": "batch void",
        "schema": {
          "type": "object",
          "properties": {"ids": {"type": "array", "items": {"$ref": "#/definitions/orders/definitions/id"}}},
          "required": ["ids"]
        },
        "targetSchema": {
          "type": "array",
          "items": {
            "id": {"$ref": "#/definitions/orders/definitions/id"},
            "status": {"type": "string", "enum": ["success", "error"]},
            "billing_status": {"$ref": "#/definitions/orders/definitions/billing_status"},
            "shipping_status": {"type": ["string", "null"]}
          }
        }
      }, {
        "authenticated": true,
        "description": "void a given order",
        "href": "/orders/{(%23%2Fdefinitions%2Forders%2Fdefinitions%2Fid)}/void",
        "method": "POST",
        "rel": "void",
        "schema": {
          "type": "object",
          "properties": {"id": {"$ref": "#/definitions/orders/definitions/id"}},
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/orders"}
      }, {"authenticated": true, "description": "I delete a order"}, {
        "authenticated": true,
        "description": "I create or update a shipping order",
        "href": "/orders/{(%23%2Fdefinitions%2Forders%2Fdefinitions%2Fid)}/shippingorder",
        "method": "PUT",
        "rel": "set shipping order",
        "schema": {
          "type": "object",
          "properties": {
            "status": {"$ref": "#/definitions/orders/definitions/shippingOrder/definitions/status"},
            "id": {"$ref": "#/definitions/orders/definitions/id"}
          },
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/orders/definitions/shippingOrder"}
      }]
    },
    "products": {
      "$schema": "http://json-schema.org/draft-04/hyper-schema",
      "description": "A product is a reference in merchant's catalog",
      "definitions": {
        "uuid": {
          "description": "the unique identifier of the product",
          "example": "01234567-89ab-cdef-0123-456789abcdef",
          "format": "uuid",
          "readOnly": true,
          "type": ["string"]
        },
        "id": {
          "description": "the identifier of the product (legacy, use uuid instead)",
          "example": "4",
          "readOnly": true,
          "type": ["integer", "string"]
        },
        "createdAt": {
          "description": "the time when a record for that product was created",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "deletedAt": {
          "description": "the time when the product was removed from the merchant's catalog",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "updatedAt": {
          "description": "the time when the product reference was updated for the last time",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "title": {"description": "the human readable label for the product", "example": "Big Mac", "type": ["string"]},
        "sku": {"description": "the Stock Keeping Unit of the product", "example": "MMC", "type": ["string"]},
        "price": {
          "description": "the default selling price for that reference",
          "example": 4.99,
          "type": ["number", "string"]
        },
        "currency": {
          "description": "the currency associated to the product price",
          "example": "USD",
          "type": ["string"]
        },
        "weight": {
          "description": "the weight value of the product (to be associated with weightUnit)",
          "example": 125.5,
          "type": ["number", "string", "null"]
        },
        "weightUnit": {
          "description": "the weight unit associated to the product (to be associated with the weightUnit)",
          "example": "kg",
          "type": ["string", "null"]
        }
      },
      "properties": {
        "uuid": {"$ref": "#/definitions/products/definitions/uuid"},
        "id": {"$ref": "#/definitions/products/definitions/id"},
        "createdAt": {"$ref": "#/definitions/products/definitions/createdAt"},
        "updatedAt": {"$ref": "#/definitions/products/definitions/updatedAt"},
        "deletedAt": {"$ref": "#/definitions/products/definitions/deletedAt"},
        "title": {"$ref": "#/definitions/products/definitions/title"},
        "sku": {"$ref": "#/definitions/products/definitions/sku"},
        "price": {"$ref": "#/definitions/products/definitions/price"},
        "currency": {"$ref": "#/definitions/products/definitions/currency"},
        "weight": {"$ref": "#/definitions/products/definitions/weight"},
        "weightUnit": {"$ref": "#/definitions/products/definitions/weightUnit"}
      },
      "type": "object",
      "links": [{
        "authenticated": true,
        "description": "get a list of products",
        "href": "/products",
        "method": "GET",
        "rel": "instances",
        "schema": {
          "type": "object",
          "properties": {
            "itemsByPage": {"type": ["integer", "string"], "minimum": 0},
            "offset": {"type": ["integer", "string"], "minimum": 0},
            "orderBy": {"type": "string"},
            "orderReverse": {"type": ["string", "boolean"]},
            "searchScope": {"type": "string"},
            "searchQuery": {"type": "string"}
          }
        },
        "targetSchema": {
          "count": {"type": "integer", "minimum": 0},
          "rows": {"type": "array", "items": {"$ref": "#/definitions/products"}},
          "type": "object"
        }
      }, {
        "authenticated": true,
        "description": "get details for a particular product",
        "href": "/products/{(%23%2Fdefinitions%2Fproducts%2Fdefinitions%2Fid)}",
        "method": "GET",
        "rel": "self",
        "schema": {
          "properties": {"id": {"$ref": "#/definitions/products/definitions/id"}},
          "required": ["id"],
          "type": "object"
        },
        "targetSchema": {"$ref": "#/definitions/products"}
      }, {
        "authenticated": true,
        "description": "create a new product in merchant's catalog",
        "href": "/products",
        "method": "POST",
        "rel": "create",
        "schema": {
          "properties": {
            "title": {"$ref": "#/definitions/products/definitions/title"},
            "sku": {"$ref": "#/definitions/products/definitions/sku"},
            "price": {"$ref": "#/definitions/products/definitions/price"},
            "currency": {"$ref": "#/definitions/products/definitions/currency"},
            "weight": {"$ref": "#/definitions/products/definitions/weight"},
            "weightUnit": {"$ref": "#/definitions/products/definitions/weightUnit"}
          }, "required": ["title", "sku", "price", "currency"], "type": ["object"]
        },
        "targetSchema": {"$ref": "#/definitions/products"}
      }, {
        "authenticated": true,
        "description": "I update a product",
        "href": "/products/{(%23%2Fdefinitions%2Fproducts%2Fdefinitions%2Fid)}",
        "method": "PUT",
        "rel": "update",
        "schema": {
          "properties": {
            "title": {"$ref": "#/definitions/products/definitions/title"},
            "sku": {"$ref": "#/definitions/products/definitions/sku"},
            "price": {"$ref": "#/definitions/products/definitions/price"},
            "currency": {"$ref": "#/definitions/products/definitions/currency"},
            "weight": {"$ref": "#/definitions/products/definitions/weight"},
            "weightUnit": {"$ref": "#/definitions/products/definitions/weightUnit"},
            "id": {"$ref": "#/definitions/products/definitions/id"}
          }, "type": "object", "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/products"}
      }, {
        "authenticated": true,
        "description": "I delete a product",
        "href": "/products/{(%23%2Fdefinitions%2Fproducts%2Fdefinitions%2Fid)}",
        "method": "DELETE",
        "rel": "destroy",
        "schema": {
          "properties": {"id": {"$ref": "#/definitions/products/definitions/id"}},
          "required": ["id"],
          "type": "object"
        }
      }]
    },
    "prospects": {
      "$schema": "http://json-schema.org/draft-04/hyper-schema",
      "description": "A prospect is a physical person registered into crm system because he/she showed interest in one of the merchant's offer",
      "definitions": {
        "uuid": {
          "description": "the unique identifier of the prospect",
          "example": "01234567-89ab-cdef-0123-456789abcdef",
          "format": "uuid",
          "readOnly": true,
          "type": ["string"]
        },
        "id": {
          "description": "the identifier of the prospect (legacy, use uuid instead)",
          "example": "4",
          "readOnly": true,
          "type": ["integer", "string"]
        },
        "createdAt": {
          "description": "the time when a record for that prospect was created",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "deletedAt": {
          "description": "the time when the prospect was removed from the merchant's catalog",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "updatedAt": {
          "description": "the time when the prospect reference was updated for the last time",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "firstname": {"description": "the firstname of the prospect", "example": "Laurent", "type": ["string"]},
        "lastname": {"description": "the lastname of the prospect", "example": "Renard", "type": ["string"]},
        "email": {
          "description": "the email of the prospect",
          "example": "foo@bar.com",
          "type": "string",
          "format": "email"
        },
        "phone": {"description": "the phone number of the prospect", "example": "123456789", "type": "string"},
        "creditCard": {
          "description": "The credit card information of a prospect",
          "type": "object",
          "properties": {
            "type": {
              "description": "the card type",
              "type": "string",
              "example": "visa",
              "enum": ["visa", "mastercard", "amex", "dinner", "jcb", "unionpay"]
            },
            "number": {"description": "the card number", "example": "4111111111111111", "type": "string"},
            "expiration": {
              "description": "the expiration date of the card (todo: format)",
              "example": "17/02",
              "type": "string"
            },
            "cardholder": {"type": "string", "description": "the card holder ful name", "example": "Renard Laurent"},
            "token": {
              "type": "string",
              "example": "2343-234324-23423",
              "description": "a token to use in place of card information"
            }
          }
        },
        "address": {
          "type": "object",
          "description": "an address (post)",
          "definitions": {},
          "properties": {
            "type": {
              "description": "the type of address (whether it is a shipping address or a billing address (todo: this should exist)",
              "type": "string",
              "example": "billing",
              "enum": ["billing", "shipping"]
            },
            "address": {"type": "string", "description": "the first line of an address", "example": "21, first avenue"},
            "city": {"type": "string", "description": "the city name of the address", "example": "New York City"},
            "region": {
              "type": "string",
              "description": "the region/state/province of the address",
              "example": "Nevada"
            },
            "zipcode": {"type": "string", "description": "the zip code of the address", "example": "34160"},
            "country": {"$ref": "#/definitions/areas/definitions/title"}
          }
        },
        "note": {
          "type": "object",
          "definitions": {
            "message": {
              "type": "string",
              "description": "the message of the node",
              "example": "continuous crm rocks!"
            }
          },
          "properties": {"message": {"$ref": "#/definitions/prospects/definitions/note/definitions/message"}}
        }
      },
      "properties": {
        "uuid": {"$ref": "#/definitions/prospects/definitions/uuid"},
        "id": {"$ref": "#/definitions/prospects/definitions/id"},
        "createdAt": {"$ref": "#/definitions/prospects/definitions/createdAt"},
        "updatedAt": {"$ref": "#/definitions/prospects/definitions/updatedAt"},
        "deletedAt": {"$ref": "#/definitions/prospects/definitions/deletedAt"},
        "firstname": {"$ref": "#/definitions/prospects/definitions/firstname"},
        "lastname": {"$ref": "#/definitions/prospects/definitions/lastname"},
        "email": {"$ref": "#/definitions/prospects/definitions/email"},
        "phone": {"$ref": "#/definitions/prospects/definitions/phone"},
        "addresses": {"type": "array", "items": {"$ref": "#/definitions/prospects/definitions/address"}},
        "credicard": {"$ref": "#/definitions/prospects/definitions/creditCard"}
      },
      "type": "object",
      "links": [{
        "authenticated": true,
        "description": "I get all prospect details",
        "href": "/prospects",
        "method": "GET",
        "rel": "instances",
        "schema": {
          "type": "object",
          "properties": {
            "from": {"type": ["integer", "string"]},
            "to": {"type": ["integer", "string"]},
            "itemsByPage": {"type": ["integer", "string"], "minimum": 0},
            "offset": {"type": ["integer", "string"], "minimum": 0},
            "orderBy": {"type": "string"},
            "orderReverse": {"type": ["string", "boolean"]},
            "searchScope": {"type": "string"},
            "searchQuery": {"type": "string"},
            "include": {
              "description": "the related resource to include",
              "type": ["array"],
              "items": {"type": "string", "enum": ["order"]}
            }
          }
        },
        "targetSchema": {
          "type": "object",
          "properties": {
            "count": {"type": "integer", "minimum": 0},
            "rows": {"type": "array", "items": {"$ref": "#/definitions/prospects"}}
          }
        }
      }, {
        "authenticated": true,
        "description": "I get an prospect details",
        "href": "/prospects/{(%23%2Fdefinitions%2Fprospects%2Fdefinitions%2Fuuid)}",
        "method": "GET",
        "rel": "self",
        "schema": {
          "type": "object",
          "properties": {"uuid": {"$ref": "#/definitions/prospects/definitions/uuid"}},
          "required": ["uuid"]
        },
        "targetSchema": {"$ref": "#/definitions/prospects"}
      }, {
        "authenticated": true,
        "description": "I add a prospect",
        "href": "/prospects",
        "method": "POST",
        "rel": "create",
        "schema": {
          "type": "object",
          "properties": {
            "email": {"$ref": "#/definitions/prospects/definitions/email"},
            "billing": {"$ref": "#/definitions/prospects/definitions/address"},
            "shipping": {"$ref": "#/definitions/prospects/definitions/address"},
            "firstname": {"$ref": "#/definitions/prospects/definitions/firstname"},
            "lastname": {"$ref": "#/definitions/prospects/definitions/lastname"},
            "phone": {"$ref": "#/definitions/prospects/definitions/phone"}
          },
          "required": ["email", "billing", "shipping"]
        },
        "targetSchema": {"$ref": "#/definitions/prospects"}
      }, {
        "authenticated": true,
        "description": "I get a prospect notes",
        "href": "/prospects/{(%23%2Fdefinitions%2Fprospects%2Fdefinitions%2Fuuid)}/notes",
        "method": "GET",
        "rel": "notes",
        "schema": {
          "type": "object",
          "properties": {"uuid": {"$ref": "#/definitions/prospects/definitions/uuid"}},
          "required": ["uuid"]
        },
        "targetSchema": {"type": "array", "items": {"$ref": "#/definitions/prospects/definitions/note"}}
      }, {
        "authenticated": true,
        "description": "I add a note to the prospect",
        "href": "/prospects/{(%23%2Fdefinitions%2Fprospects%2Fdefinitions%2Fuuid)}/notes",
        "method": "POST",
        "rel": "add note",
        "schema": {
          "type": "object",
          "properties": {
            "uuid": {"$ref": "#/definitions/prospects/definitions/uuid"},
            "message": {"$ref": "#/definitions/prospects/definitions/note/definitions/message"},
            "author": {"description": "todo", "type": ["string", "number"]}
          },
          "required": ["uuid", "message", "author"]
        },
        "targetSchema": {"$ref": "#/definitions/prospects"}
      }, {"authenticated": true, "description": "I delete a prospect"}, {
        "authenticated": true,
        "description": "I update a prospect",
        "href": "/prospects/{(%23%2Fdefinitions%2Fprospects%2Fdefinitions%2Fuuid)}",
        "method": "PUT",
        "rel": "update",
        "schema": {
          "type": "object",
          "properties": {
            "uuid": {"$ref": "#/definitions/prospects/definitions/uuid"},
            "email": {"$ref": "#/definitions/prospects/definitions/email"},
            "firstname": {"$ref": "#/definitions/prospects/definitions/firstname"},
            "lastname": {"$ref": "#/definitions/prospects/definitions/lastname"},
            "phone": {"$ref": "#/definitions/prospects/definitions/phone"}
          },
          "required": ["uuid"]
        },
        "targetSchema": {"$ref": "#/definitions/prospects"}
      }]
    },
    "roles": {
      "$schema": "http://json-schema.org/draft-04/hyper-schema",
      "description": "A role define the access access rights a user can have for a particular merchant",
      "definitions": {
        "uuid": {
          "description": "the unique identifier of the role",
          "example": "01234567-89ab-cdef-0123-456789abcdef",
          "format": "uuid",
          "readOnly": true,
          "type": ["string"]
        },
        "id": {
          "description": "the identifier of the role (legacy, use uuid instead)",
          "example": "4",
          "readOnly": true,
          "type": ["integer", "string"]
        },
        "createdAt": {
          "description": "the time when a record for that role was created",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "deletedAt": {
          "description": "the time when the role was removed from the merchant's catalog",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "updatedAt": {
          "description": "the time when the role reference was updated for the last time",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "title": {"description": "the human readable label for the role", "example": "Big Mac", "type": ["string"]},
        "permissions": {
          "description": "A map of the different permission the role provide to a user",
          "example": "{} todo",
          "type": ["object", "array"]
        }
      },
      "properties": {
        "uuid": {"$ref": "#/definitions/roles/definitions/uuid"},
        "id": {"$ref": "#/definitions/roles/definitions/id"},
        "createdAt": {"$ref": "#/definitions/roles/definitions/createdAt"},
        "updatedAt": {"$ref": "#/definitions/roles/definitions/updatedAt"},
        "deletedAt": {"$ref": "#/definitions/roles/definitions/deletedAt"},
        "title": {"$ref": "#/definitions/roles/definitions/title"},
        "permissions": {"$ref": "#/definitions/roles/definitions/permissions"}
      },
      "type": "object",
      "links": [{
        "authenticated": true,
        "description": "I get all role details",
        "href": "/roles",
        "method": "GET",
        "rel": "instances",
        "schema": {
          "type": "object",
          "properties": {
            "itemsByPage": {"type": ["integer", "string"], "minimum": 0},
            "offset": {"type": ["integer", "string"], "minimum": 0},
            "orderBy": {"type": "string"},
            "orderReverse": {"type": ["string", "boolean"]},
            "searchScope": {"type": "string"},
            "searchQuery": {"type": "string"}
          }
        },
        "targetSchema": {"type": "array", "items": {"$ref": "#/definitions/rolse"}}
      }, {
        "authenticated": true,
        "description": "I get an role details",
        "href": "/roles/{(%23%2Fdefinitions%2Froles%2Fdefinitions%2Fid)}",
        "method": "GET",
        "rel": "self",
        "schema": {
          "type": "object",
          "properties": {"id": {"$ref": "#/definitions/roles/definitions/id"}},
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/roles"}
      }, {
        "authenticated": true,
        "description": "I add a role",
        "method": "POST",
        "rel": "create",
        "schema": {
          "type": "object",
          "properties": {
            "title": {"$ref": "#/definitions/roles/definitions/title"},
            "permissions": {"$ref": "#/definitions/roles/definitions/permissions"}
          },
          "required": ["title", "permissions"]
        },
        "targetSchema": {"$ref": "#/definitions/roles"}
      }, {
        "authenticated": true,
        "description": "I update a role",
        "href": "/roles/{(%23%2Fdefinitions%2Froles%2Fdefinitions%2Fid)}",
        "method": "PUT",
        "rel": "update",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/roles/definitions/id"},
            "title": {"$ref": "#/definitions/roles/definitions/title"},
            "permissions": {"$ref": "#/definitions/roles/definitions/permissions"}
          },
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/roles"}
      }, {
        "authenticated": true,
        "description": "I delete a role",
        "href": "/roles/{(%23%2Fdefinitions%2Froles%2Fdefinitions%2Fid)}",
        "method": "DELETE",
        "rel": "destroy",
        "schema": {
          "type": "object",
          "properties": {"id": {"$ref": "#/definitions/roles/definitions/id"}},
          "required": ["id"]
        }
      }]
    },
    "shippingOffers": {
      "$schema": "http://json-schema.org/draft-04/hyper-schema",
      "description": "A shipping offer is a set of prices per country to ship a given shipping offer from a given storehouse using a given carrier",
      "definitions": {
        "id": {
          "description": "the unique identifier of the shipping Offer",
          "example": "01234567-89ab-cdef-0123-456789abcdef",
          "format": "uuid",
          "readOnly": true,
          "type": ["string"]
        },
        "createdAt": {
          "description": "the time when a record for that shipping offer  was created",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "deletedAt": {
          "description": "the time when the shipping offer was removed from the merchant's catalog",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "updatedAt": {
          "description": "the time when the shipping offer reference was updated for the last time",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "title": {
          "description": "the human readable label for the shipping offer",
          "example": "Big Mac",
          "type": ["string"]
        },
        "shippingPrice": {
          "description": "the price for the shipping",
          "type": "object",
          "properties": {
            "country": {"$ref": "#/definitions/areas"},
            "amount": {"type": ["number", "string"], "description": "the price (in USD) of an item delivery"}
          }
        }
      },
      "properties": {
        "id": {"$ref": "#/definitions/shippingOffers/definitions/id"},
        "createdAt": {"$ref": "#/definitions/shippingOffers/definitions/createdAt"},
        "updatedAt": {"$ref": "#/definitions/shippingOffers/definitions/updatedAt"},
        "deletedAt": {"$ref": "#/definitions/shippingOffers/definitions/deletedAt"},
        "title": {"$ref": "#/definitions/shippingOffers/definitions/title"},
        "shippingPrices": {
          "type": "array",
          "items": {"$ref": "#/definitions/shippingOffers/definitions/shippingPrice"}
        },
        "stocks": {"type": "array", "items": {"$ref": "#/definitions/stocks"}}
      },
      "type": "object",
      "links": [{
        "authenticated": true,
        "description": "get a list of shipping offers",
        "href": "/shippingoffers",
        "method": "GET",
        "rel": "instances",
        "schema": {
          "type": "object",
          "properties": {
            "carrierId": {"$ref": "#/definitions/carriers/definitions/id"},
            "storehouseId": {"$ref": "#/definitions/storehouses/definitions/id"},
            "productId": {"$ref": "#/definitions/products/definitions/id"},
            "itemsByPage": {"type": ["integer", "string"], "minimum": 0},
            "offset": {"type": ["integer", "string"], "minimum": 0},
            "orderBy": {"type": "string"},
            "orderReverse": {"type": ["string", "boolean"]},
            "searchScope": {"type": "string"},
            "searchQuery": {"type": "string"}
          }
        },
        "targetSchema": {"type": "array", "items": {"$ref": "#/definitions/shippingOffers"}}
      }, {
        "authenticated": true,
        "description": "I create a shipping offer",
        "href": "/shippingoffers",
        "method": "POST",
        "rel": "create",
        "schema": {
          "type": "object",
          "properties": {
            "stockId": {"$ref": "#/definitions/stocks/definitions/id"},
            "carrierId": {"$ref": "#/definitions/carriers/definitions/id"},
            "title": {"$ref": "#/definitions/shippingOffers/definitions/title"},
            "shippingPrices": {
              "type": "array",
              "items": {"$ref": "#/definitions/shippingOffers/definitions/shippingPrice"}
            }
          },
          "required": ["stockId", "carrierId", "title"]
        },
        "targetSchema": {"$ref": "#/definitions/shippingoffers"}
      }]
    },
    "stocks": {
      "$schema": "http://json-schema.org/draft-04/hyper-schema",
      "description": "A stock reference a given product within a given storehouse",
      "definitions": {
        "id": {
          "description": "the unique identifier of the stock",
          "example": "01234567-89ab-cdef-0123-456789abcdef",
          "format": "uuid",
          "readOnly": true,
          "type": ["string"]
        },
        "createdAt": {
          "description": "the time when a record for that stock was created",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "deletedAt": {
          "description": "the time when the stock was removed from the merchant's catalog",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "updatedAt": {
          "description": "the time when the stock reference was updated for the last time",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "quantity": {
          "description": "the quantity of items in the stock",
          "example": 1000,
          "type": ["integer", "string"]
        },
        "handlingCost": {
          "description": "the cost to handle the particular item in the particular storehouse",
          "type": ["number", "string"],
          "example": 12.45
        }
      },
      "properties": {
        "id": {"$ref": "#/definitions/stocks/definitions/id"},
        "createdAt": {"$ref": "#/definitions/stocks/definitions/createdAt"},
        "updatedAt": {"$ref": "#/definitions/stocks/definitions/updatedAt"},
        "deletedAt": {"$ref": "#/definitions/stocks/definitions/deletedAt"},
        "quantity": {"$ref": "#/definitions/stocks/definitions/quantity"},
        "handlingCost": {"$ref": "#/definitions/stocks/definitions/handlingCost"},
        "product": {"type": ["object", "null"], "allOf": ["#/definitions/products"]},
        "storehouse": {"type": ["object", "null"], "allOf": ["#/definitions/storehouses"]}
      },
      "type": "object",
      "links": [{
        "authenticated": true,
        "description": "get the merchant stocks",
        "href": "/stocks",
        "method": "GET",
        "rel": "instances",
        "schema": {
          "type": "object",
          "properties": {
            "productId": {"$ref": "#/definitions/products/definitions/id"},
            "storehouseId": {"$ref": "#/definitions/storehouses/definitions/id"},
            "itemsByPage": {"type": ["integer", "string"], "minimum": 0},
            "offset": {"type": ["integer", "string"], "minimum": 0},
            "orderBy": {"type": "string"},
            "orderReverse": {"type": ["string", "boolean"]},
            "searchScope": {"type": "string"},
            "searchQuery": {"type": "string"},
            "include": {
              "description": "the related resource to include",
              "type": ["array"],
              "items": {"type": "string", "enum": ["storehouse", "product"]}
            }
          }
        },
        "targetSchema": {
          "count": {"type": "integer", "minimum": 0},
          "rows": {"type": "array", "items": {"$ref": "#/definitions/stocks"}},
          "type": "object"
        }
      }, {
        "authenticated": true,
        "description": "get a particular stock reference",
        "href": "/stocks/{(%23%2Fdefinitions%2Fstocks%2Fdefinitions%2Fid)}",
        "method": "GET",
        "rel": "self",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/stocks/definitions/id"},
            "include": {
              "description": "the related resource to include",
              "type": ["array"],
              "items": {"type": "string", "enum": ["storehouse", "product"]}
            }
          },
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/stocks"}
      }, {
        "authenticated": true,
        "description": "update a particular stock reference",
        "href": "/stocks/{(%23%2Fdefinitions%2Fstocks%2Fdefinitions%2Fid)}",
        "method": "PUT",
        "rel": "update",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/stocks/definitions/id"},
            "handlingCost": {"$ref": "#/definitions/stocks/definitions/handlingCost"},
            "quantity": {"$ref": "#/definitions/stocks/definitions/quantity"}
          },
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/stocks"}
      }, {
        "authenticated": true,
        "description": "delete a stock reference",
        "href": "/stocks/{(%23%2Fdefinitions%2Fstocks%2Fdefinitions%2Fid)}",
        "method": "DELETE",
        "rel": "destroy",
        "schema": {
          "type": "object",
          "properties": {"id": {"$ref": "#/definitions/stocks/definitions/id"}},
          "required": ["id"]
        }
      }, {
        "authenticated": true,
        "description": "create a new stock",
        "href": "/stocks",
        "method": "POST",
        "rel": "create",
        "schema": {
          "type": "object",
          "properties": {
            "productId": {"$ref": "#/definitions/products/definitions/id"},
            "storehouseId": {"$ref": "#/definitions/storehouses/definitions/id"},
            "quantity": {"$ref": "#/definitions/stocks/definitions/quantity"},
            "handlingCost": {"$ref": "#/definitions/stocks/definitions/handlingCost"}
          },
          "required": ["productId", "storehouseId", "quantity"]
        },
        "targetSchema": {"$ref": "#/definitions/stocks"}
      }]
    },
    "storehouses": {
      "$schema": "http://json-schema.org/draft-04/hyper-schema",
      "description": "A storehouse is where physicals product are stored",
      "definitions": {
        "id": {
          "description": "the unique identifier of the storehouse",
          "example": "01234567-89ab-cdef-0123-456789abcdef",
          "format": "uuid",
          "readOnly": true,
          "type": ["string"]
        },
        "createdAt": {
          "description": "the time when a record for that storehouse was created",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "deletedAt": {
          "description": "the time when the storehouse was removed from the merchant's collection",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "updatedAt": {
          "description": "the time when the storehouse reference was updated for the last time",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "title": {
          "description": "the human readable label for the storehouse",
          "example": "Amazon at Londong",
          "type": ["string"]
        },
        "credentials": {
          "description": "the credentials requested to use a third party fulfillment integration system",
          "type": ["object", "null"]
        },
        "defaultHandlingCost": {
          "descriptions": "the estimated cost of operation per item",
          "type": ["number", "string"]
        },
        "type": {
          "description": "the type of fulfillment solution used",
          "type": "string",
          "enum": ["manual", "shipwire", "postmaster", "amazon"]
        }
      },
      "properties": {
        "id": {"$ref": "#/definitions/storehouses/definitions/id"},
        "createdAt": {"$ref": "#/definitions/storehouses/definitions/createdAt"},
        "updatedAt": {"$ref": "#/definitions/storehouses/definitions/updatedAt"},
        "deletedAt": {"$ref": "#/definitions/storehouses/definitions/deletedAt"},
        "title": {"$ref": "#/definitions/storehouses/definitions/title"},
        "credentials": {"$ref": "#/definitions/storehouses/definitions/credentials"},
        "defaultHandlingCost": {"$ref": "#/definitions/storehouses/definitions/defaultHandlingCost"},
        "type": {"$ref": "#/definitions/storehouses/definitions/type"}
      },
      "type": "object",
      "links": [{
        "authenticated": true,
        "description": "I get all storehouse details",
        "href": "/storehouses",
        "method": "GET",
        "rel": "instances",
        "schema": {
          "type": "object",
          "properties": {
            "itemsByPage": {"type": ["integer", "string"], "minimum": 0},
            "offset": {"type": ["integer", "string"], "minimum": 0},
            "orderBy": {"type": "string"},
            "orderReverse": {"type": ["string", "boolean"]},
            "searchScope": {"type": "string"},
            "searchQuery": {"type": "string"},
            "include": {
              "description": "the related resource to include",
              "type": ["array"],
              "items": {"type": "string", "enum": ["product"]}
            }
          }
        },
        "targetSchema": {
          "count": {"type": "integer", "minimum": 0},
          "rows": {"type": "array", "items": {"$ref": "#/definitions/storehouses"}},
          "type": "object"
        }
      }, {
        "authenticated": true,
        "description": "I get an storehouse details",
        "href": "/storehouses/{(%23%2Fdefinitions%2Fstorehouses%2Fdefinitions%2Fid)}",
        "method": "GET",
        "rel": "self",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/storehouses/definitions/id"},
            "include": {
              "description": "the related resource to include",
              "type": ["array"],
              "items": {"type": "string", "enum": ["product"]}
            }
          },
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/storehouses"}
      }, {
        "authenticated": true,
        "description": "I add a storehouse",
        "href": "/storehouses",
        "method": "POST",
        "rel": "create",
        "schema": {
          "type": "object",
          "properties": {
            "title": {"$ref": "#/definitions/storehouses/definitions/title"},
            "type": {"$ref": "#/definitions/storehouses/definitions/type"},
            "credentials": {"$ref": "#/definitions/storehouses/definitions/credentials"},
            "defaultHandlingCost": {"$ref": "#/definitions/storehouses/definitions/defaultHandlingCost"}
          },
          "required": ["type", "title"]
        },
        "targetSchema": {"$ref": "#/definitions/storehouses"}
      }, {
        "authenticated": true,
        "description": "I update a storehouse",
        "href": "/storehouses/{(%23%2Fdefinitions%2Fstorehouses%2Fdefinitions%2Fid)}",
        "method": "PUT",
        "rel": "update",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/storehouses/definitions/id"},
            "title": {"$ref": "#/definitions/storehouses/definitions/title"},
            "credentials": {"$ref": "#/definitions/storehouses/definitions/credentials"},
            "defaultHandlingCost": {"$ref": "#/definitions/storehouses/definitions/defaultHandlingCost"}
          },
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/storehouses"}
      }, {
        "authenticated": true,
        "description": "I delete a storehouse",
        "href": "/storehouses/{(%23%2Fdefinitions%2Fstorehouses%2Fdefinitions%2Fid)}",
        "method": "DELETE",
        "rel": "destroy",
        "schema": {
          "type": "object",
          "properties": {"id": {"$ref": "#/definitions/storehouses/definitions/id"}},
          "required": ["id"]
        }
      }]
    },
    "subscriptions": {
      "$schema": "http://json-schema.org/draft-04/hyper-schema",
      "description": "A subscription is a recurring payment associated to a customer",
      "definitions": {
        "id": {
          "description": "the unique identifier of the subscription",
          "example": "01234567-89ab-cdef-0123-456789abcdef",
          "format": "uuid",
          "readOnly": true,
          "type": ["string"]
        },
        "createdAt": {
          "description": "the time when a record for that subscription was created",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "deletedAt": {
          "description": "the time when the subscription was removed from the merchant's catalog",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "updatedAt": {
          "description": "the time when the subscription reference was updated for the last time",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "nextDate": {
          "description": "the time when the next payment will occur",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string", "null"]
        },
        "onHold": {
          "description": "A flag to notify whether the subscription is on pause",
          "example": true,
          "default": false,
          "type": ["boolean", "string"]
        },
        "remainingIterations": {
          "description": "the number of payment occurrences before the subscription ends",
          "example": 2,
          "type": ["integer", "string"]
        }
      },
      "properties": {
        "id": {"$ref": "#/definitions/subscriptions/definitions/id"},
        "createdAt": {"$ref": "#/definitions/subscriptions/definitions/createdAt"},
        "updatedAt": {"$ref": "#/definitions/subscriptions/definitions/updatedAt"},
        "deletedAt": {"$ref": "#/definitions/subscriptions/definitions/deletedAt"},
        "nextDate": {"$ref": "#/definitions/subscriptions/definitions/nextDate"},
        "onHold": {"$ref": "#/definitions/subscriptions/definitions/onHold"},
        "remainingIterations": {"$ref": "#/definitions/subscriptions/definitions/remainingIterations"},
        "prospect": {"$ref": "#/definitions/prospects"},
        "recurringPlan": {"$ref": "#/definitions/offers/definitions/recurringPlan"},
        "bank": {"$ref": "#/definitions/banks"},
        "campaign": {"$ref": "#/definitions/campaigns"}
      },
      "type": "object",
      "links": [{
        "authenticated": true,
        "description": "I get a list of subscriptions",
        "href": "/subscriptions",
        "method": "GET",
        "rel": "instances",
        "schema": {
          "type": "object",
          "properties": {
            "itemsByPage": {"type": ["integer", "string"], "minimum": 0},
            "offset": {"type": ["integer", "string"], "minimum": 0},
            "orderBy": {"type": "string"},
            "orderReverse": {"type": ["string", "boolean"]},
            "searchScope": {"type": "string"},
            "searchQuery": {"type": "string"},
            "include": {
              "description": "the related resource to include",
              "type": ["array"],
              "items": {"type": "string", "enum": ["prospect", "recurringPlan", "bank", "campaign"]}
            }
          }
        },
        "targetSchema": {"type": "array", "items": {"$ref": "#/definitions/subscriptions"}}
      }, {
        "authenticated": true,
        "description": "get subscription details",
        "href": "/subscriptions/{(%23%2Fdefinitions%2Fsubscriptions%2Fdefinitions%2Fid)}",
        "method": "GET",
        "rel": "self",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/subscriptions/definitions/id"},
            "include": {
              "description": "the related resource to include",
              "type": ["array"],
              "items": {"type": "string", "enum": ["prospect", "recurringPlan", "bank", "campaign"]}
            }
          },
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/subscriptions"}
      }, {
        "authenticated": true,
        "description": "I add a subscription",
        "href": "/subscriptions",
        "method": "POST",
        "rel": "create",
        "schema": {
          "type": "object",
          "properties": {
            "refTransactionId": {"$ref": "#/definitions/orders/definitions/id"},
            "nextDate": {"$ref": "#/definitions/subscriptions/definitions/nextDate"}
          },
          "required": ["refTransactionId"]
        },
        "targetSchema": {"$ref": "#/definitions/subscriptions"}
      }, {
        "authenticated": true,
        "description": "update subscription",
        "href": "/subscriptions/{(%23%2Fdefinitions%2Fsubscriptions%2Fdefinitions%2Fid)}",
        "method": "PUT",
        "rel": "update",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/subscriptions/definitions/id"},
            "onHold": {"$ref": "#/definitions/subscriptions/definitions/onHold"}
          },
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/subscriptions"}
      }]
    },
    "trackers": {
      "$schema": "http://json-schema.org/draft-04/hyper-schema",
      "description": "Tracker for merchant associated network",
      "definitions": {
        "uuid": {
          "description": "the unique identifier of the tracker",
          "example": "01234567-89ab-cdef-0123-456789abcdef",
          "format": "uuid",
          "readOnly": true,
          "type": ["string"]
        },
        "id": {
          "description": "the identifier of the tracker (legacy, use uuid instead)",
          "example": "4",
          "readOnly": true,
          "type": ["integer", "string"]
        },
        "createdAt": {
          "description": "the time when a record for that tracker was created",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "deletedAt": {
          "description": "the time when the tracker was removed from the merchant's catalog",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "updatedAt": {
          "description": "the time when the tracker reference was updated for the last time",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "title": {"description": "the human readable label for the tracker", "example": "Big Mac", "type": ["string"]},
        "identifier": {
          "description": "the identifier of the tracker (for external system)",
          "type": "string",
          "example": "aff"
        },
        "channel": {
          "description": "the channel associated to the tracker",
          "type": "string",
          "example": "target click"
        },
        "event": {"description": "I have no idea", "type": "string", "example": "I have no idea"},
        "pixel": {
          "description": "the pixel code of the tracker",
          "type": "string",
          "example": "https://track.paydot.com/sale.php?sid=1100&oid=[ORDER_ID]&pid=DEFAULT&value=[PRICE]&currency=[CURRENCY]&ht=img"
        },
        "status": {"description": "I have no idea", "type": "string", "example": "I have no idea"},
        "type": {
          "description": "the type of tracker used",
          "example": "image",
          "type": "string",
          "enum": ["image", "javascript", "snippet"]
        },
        "parameter": {"description": "I have no idea", "example": "I have no idea", "type": ["string"]}
      },
      "properties": {
        "uuid": {"$ref": "#/definitions/trackers/definitions/uuid"},
        "id": {"$ref": "#/definitions/trackers/definitions/id"},
        "createdAt": {"$ref": "#/definitions/trackers/definitions/createdAt"},
        "updatedAt": {"$ref": "#/definitions/trackers/definitions/updatedAt"},
        "deletedAt": {"$ref": "#/definitions/trackers/definitions/deletedAt"},
        "title": {"$ref": "#/definitions/trackers/definitions/title"},
        "parameter": {"$ref": "#/definitions/tracers/definitions/parameter"},
        "channel": {"$ref": "#/definitions/trackers/definitions/channel"},
        "event": {"$ref": "#/definitions/trackers/definitions/event"},
        "type": {"$ref": "#/definitions/trackers/definitions/type"},
        "pixel": {"$ref": "#/definitions/trackers/definitions/pixel"}
      },
      "type": "object",
      "links": [{
        "authenticated": true,
        "description": "I get all tracker details",
        "href": "/trackers",
        "method": "GET",
        "rel": "instances",
        "schema": {
          "type": "object",
          "properties": {
            "itemsByPage": {"type": ["integer", "string"], "minimum": 0},
            "offset": {"type": ["integer", "string"], "minimum": 0},
            "orderBy": {"type": "string"},
            "orderReverse": {"type": ["string", "boolean"]},
            "searchScope": {"type": "string"},
            "searchQuery": {"type": "string"},
            "include": {
              "description": "the related resource to include",
              "type": ["array"],
              "items": {"type": "string", "enum": ["campaign"]}
            }
          }
        },
        "targetSchema": {
          "count": {"type": "integer", "minimum": 0},
          "rows": {"type": "array", "items": {"$ref": "#/definitions/trackers"}},
          "type": "object"
        }
      }, {
        "authenticated": true,
        "description": "I get an tracker details",
        "href": "/trackers/{(%23%2Fdefinitions%2Ftrackers%2Fdefinitions%2Fid)}",
        "method": "GET",
        "rel": "self",
        "schema": {
          "properties": {"id": {"$ref": "#/definitions/trackers/definitions/id"}},
          "required": ["id"],
          "type": "object"
        },
        "targetSchema": {"$ref": "#/definitions/trackers"}
      }, {
        "authenticated": true,
        "description": "I add a tracker",
        "href": "/trackers",
        "method": "POST",
        "rel": "create",
        "schema": {
          "properties": {
            "title": {"$ref": "#/definitions/trackers/definitions/title"},
            "parameter": {"$ref": "#/definitions/trackers/definitions/parameter"},
            "identifier": {"$ref": "#/definitions/trackers/definitions/identifier"},
            "channel": {"$ref": "#/definitions/trackers/definitions/channel"},
            "event": {"$ref": "#/definitions/trackers/definitions/event"},
            "type": {"$ref": "#/definitions/trackers/definitions/type"},
            "pixel": {"$ref": "#/definitions/trackers/definitions/pixel"}
          }, "required": ["title", "parameter", "identifier", "channel", "event", "type", "pixel"], "type": "object"
        },
        "targetSchema": {"$ref": "#/definitions/trackers"}
      }, {
        "authenticated": true,
        "description": "I update a tracker",
        "href": "/trackers/{(%23%2Fdefinitions%2Ftrackers%2Fdefinitions%2Fid)}",
        "method": "PUT",
        "rel": "update",
        "schema": {
          "properties": {
            "id": {"$ref": "#/definitions/trackers/definitions/id"},
            "title": {"$ref": "#/definitions/trackers/definitions/title"},
            "parameter": {"$ref": "#/definitions/trackers/definitions/parameter"},
            "identifier": {"$ref": "#/definitions/trackers/definitions/identifier"},
            "channel": {"$ref": "#/definitions/trackers/definitions/channel"},
            "event": {"$ref": "#/definitions/trackers/definitions/event"},
            "type": {"$ref": "#/definitions/trackers/definitions/type"},
            "pixel": {"$ref": "#/definitions/trackers/definitions/pixel"}
          }, "required": ["id"], "type": "object"
        },
        "targetSchema": {"$ref": "#/definitions/trackers"}
      }, {
        "authenticated": true,
        "description": "I delete a tracker",
        "href": "/trackers/{(%23%2Fdefinitions%2Ftrackers%2Fdefinitions%2Fid)}",
        "method": "DELETE",
        "rel": "destroy",
        "schema": {
          "properties": {"id": {"$ref": "#/definitions/trackers/definitions/id"}},
          "required": ["id"],
          "type": "object"
        }
      }]
    },
    "upsells": {
      "$schema": "http://json-schema.org/draft-04/hyper-schema",
      "description": "An upsell is an offer proposed on top of another offer",
      "definitions": {
        "id": {
          "description": "the identifier of the upsell (legacy, use uuid instead)",
          "example": "4",
          "readOnly": true,
          "type": ["integer", "string"]
        },
        "createdAt": {
          "description": "the time when a record for that upsell was created",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "deletedAt": {
          "description": "the time when the upsell was removed from the merchant's catalog",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "updatedAt": {
          "description": "the time when the upsell reference was updated for the last time",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "type": {
          "description": "the type of the upsell",
          "example": "insert",
          "type": "string",
          "enum": ["insert", "modal"]
        }
      },
      "properties": {
        "id": {"$ref": "#/definitions/upsells/definitions/id"},
        "createdAt": {"$ref": "#/definitions/upsells/definitions/createdAt"},
        "updatedAt": {"$ref": "#/definitions/upsells/definitions/updatedAt"},
        "deletedAt": {"$ref": "#/definitions/upsells/definitions/deletedAt"},
        "type": {"$ref": "#/definitions/upsells/definitions/type"},
        "UpsellOffer": {"$ref": "#/definitions/offers"},
        "ParentOffer": {"$ref": "#/definitions/offers"}
      },
      "type": "object",
      "links": [{
        "authenticated": true,
        "description": "I get all upsell details",
        "href": "/upsells",
        "method": "GET",
        "rel": "instances",
        "schema": {
          "type": "object",
          "properties": {
            "itemsByPage": {"type": ["integer", "string"], "minimum": 0},
            "offset": {"type": ["integer", "string"], "minimum": 0},
            "orderBy": {"type": "string"},
            "orderReverse": {"type": ["string", "boolean"]},
            "searchScope": {"type": "string"},
            "searchQuery": {"type": "string"},
            "include": {
              "description": "the related resource to include",
              "type": ["array"],
              "items": {"type": "string", "enum": ["campaign", "offer", "parent"]}
            }
          }
        },
        "targetSchema": {"type": "array", "items": {"$ref": "#/definitions/upsells"}}
      }, {
        "authenticated": true,
        "description": "I get an upsell details",
        "href": "/upsells/{(%23%2Fdefinitions%2Fupsells%2Fdefinitions%2Fid)}",
        "method": "GET",
        "rel": "self",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/upsells/definitions/id"},
            "include": {
              "description": "the related resource to include",
              "type": ["array"],
              "items": {"type": "string", "enum": ["campaign", "offer", "parent"]}
            }
          },
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/upsells"}
      }, {
        "authenticated": true,
        "description": "I add an upsell",
        "href": "/upsells",
        "method": "POST",
        "rel": "create",
        "schema": {
          "type": "object",
          "properties": {
            "type": {"$ref": "#/definitions/upsells/definitions/type"},
            "offerId": {"$ref": "#/definitions/offers/definitions/id"},
            "campaignId": {"$ref": "#/definitions/campaigns/definitions/id"},
            "parentId": {"$ref": "#/definitions/offers/definitions/id"}
          },
          "required": ["type", "offerId", "campaignId"]
        },
        "targetSchema": {"$ref": "#/definitions/upsells"}
      }, {
        "authenticated": true,
        "description": "I update an upsell",
        "href": "/upsells/{(%23%2Fdefinitions%2Fupsells%2Fdefinitions%2Fid)}",
        "method": "PUT",
        "rel": "update",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/upsells/definitions/id"},
            "type": {"$ref": "#/definitions/upsells/definitions/type"},
            "offer": {
              "type": "object",
              "properties": {"id": {"$ref": "#/definitions/offers/definitions/id"}},
              "required": ["id"]
            },
            "parent": {
              "type": "object",
              "properties": {"id": {"$ref": "#/definitions/offers/definitions/id"}},
              "required": ["id"]
            }
          },
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/upsells"}
      }, {
        "authenticated": true,
        "description": "I delete a upsell",
        "href": "/upsells/{(%23%2Fdefinitions%2Fupsells%2Fdefinitions%2Fid)}",
        "method": "DELETE",
        "rel": "destroy",
        "schema": {
          "type": "object",
          "properties": {"id": {"$ref": "#/definitions/upsells/definitions/id"}},
          "required": ["id"]
        }
      }]
    },
    "users": {
      "$schema": "http://json-schema.org/draft-04/hyper-schema",
      "description": "A user is a physical person which have several access right to the application",
      "definitions": {
        "uuid": {
          "description": "the unique identifier of the user",
          "example": "01234567-89ab-cdef-0123-456789abcdef",
          "format": "uuid",
          "readOnly": true,
          "type": ["string"]
        },
        "id": {
          "description": "the identifier of the user (legacy, use uuid instead)",
          "example": "4",
          "readOnly": true,
          "type": ["integer", "string"]
        },
        "createdAt": {
          "description": "the time when a record for that user was created",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "deletedAt": {
          "description": "the time when the user was removed from the merchant's catalog",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "updatedAt": {
          "description": "the time when the user reference was updated for the last time",
          "example": "2012-01-01T12:00:00Z",
          "format": "date-time",
          "readOnly": true,
          "type": ["string"]
        },
        "firstname": {"description": "the firstname of the user", "example": "Laurent", "type": ["string", "null"]},
        "lastname": {"description": "the lastname of the user", "example": "Renard", "type": ["string", "null"]},
        "avatar_url": {
          "description": "the url to find the avatar representation of the user",
          "example": "http://avatar.com/laurentrenard",
          "type": "string",
          "format": "uri"
        },
        "email": {
          "description": "the email address of the user",
          "example": "laurent@renard.com",
          "type": "string",
          "format": "email"
        },
        "password": {"description": "the password of the user", "example": "lolipop", "type": "string"},
        "notify": {
          "description": "A flag to tell whether the user should be notified on merchant events",
          "example": "true",
          "type": ["boolean", "null"]
        }
      },
      "properties": {
        "uuid": {"$ref": "#/definitions/users/definitions/uuid"},
        "id": {"$ref": "#/definitions/users/definitions/id"},
        "createdAt": {"$ref": "#/definitions/users/definitions/createdAt"},
        "updatedAt": {"$ref": "#/definitions/users/definitions/updatedAt"},
        "deletedAt": {"$ref": "#/definitions/users/definitions/deletedAt"},
        "firstname": {"$ref": "#/definitions/users/definitions/firstname"},
        "lastname": {"$ref": "#/definitions/users/definitions/lastname"},
        "avatar_url": {"$ref": "#/definitions/users/definitions/avatar_url"},
        "email": {"$ref": "#/definitions/users/definitions/email"},
        "notify": {"$ref": "#/definitions/users/definitions/notify"},
        "roles": {"type": "array", "items": {"$ref": "#/definitions/roles"}}
      },
      "type": "object",
      "links": [{
        "authenticated": true,
        "description": "I get all users details",
        "href": "/users",
        "method": "GET",
        "rel": "instances",
        "schema": {
          "type": "object",
          "properties": {
            "itemsByPage": {"type": ["integer", "string"], "minimum": 0},
            "offset": {"type": ["integer", "string"], "minimum": 0},
            "orderBy": {"type": "string"},
            "orderReverse": {"type": ["string", "boolean"]},
            "searchScope": {"type": "string"},
            "searchQuery": {"type": "string"}
          }
        },
        "targetSchema": {"type": "array", "items": {"$ref": "#/definitions/users"}}
      }, {
        "authenticated": true,
        "description": "I get an user details",
        "href": "/users/{(%23%2Fdefinitions%2Fusers%2Fdefinitions%2Fid)}",
        "method": "GET",
        "rel": "self",
        "schema": {
          "type": "object",
          "properties": {"id": {"$ref": "#/definitions/users/definitions/id"}},
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/users"}
      }, {
        "authenticated": true,
        "description": "I add a user",
        "href": "/users",
        "method": "POST",
        "rel": "create",
        "schema": {
          "type": "object",
          "properties": {
            "email": {"$ref": "#/definitions/users/definitions/email"},
            "role": {
              "type": "object",
              "properties": {"id": {"$ref": "#/definitions/roles/definitions/id"}},
              "required": ["id"]
            },
            "notify": {"$ref": "#/definitions/users/definitions/notify"}
          },
          "required": ["email", "role"]
        },
        "targetSchema": {"$ref": "#/definitions/users"}
      }, {
        "authenticated": true,
        "description": "I update a user",
        "href": "/users/{(%23%2Fdefinitions%2Fusers%2Fdefinitions%2Fid)}",
        "method": "PUT",
        "rel": "update",
        "schema": {
          "type": "object",
          "properties": {
            "id": {"$ref": "#/definitions/users/definitions/id"},
            "firstname": {"$ref": "#/definitions/users/definitions/firstname"},
            "lastname": {"$ref": "#/definitions/users/definitions/lastname"},
            "email": {"$ref": "#/definitions/users/definitions/email"},
            "notify": {"$ref": "#/definitions/users/definitions/notify"},
            "role": {
              "type": "object",
              "properties": {"id": {"$ref": "#/definitions/roles/definitions/id"}},
              "required": ["id"]
            },
            "password": {"$ref": "#/definitions/users/definitions/password"}
          },
          "required": ["id"]
        },
        "targetSchema": {"$ref": "#/definitions/users"}
      }, {
        "authenticated": true,
        "description": "I delete a user",
        "href": "/users/{(%23%2Fdefinitions%2Fusers%2Fdefinitions%2Fid)}",
        "method": "DELETE",
        "rel": "destroy",
        "schema": {
          "type": "object",
          "properties": {"id": {"$ref": "#/definitions/users/definitions/id"}},
          "required": ["id"]
        }
      }, {
        "authenticated": false,
        "description": "I authenticate a user",
        "href": "/authenticate",
        "method": "POST",
        "rel": "login",
        "schema": {
          "type": "object",
          "properties": {
            "email": {"$ref": "#/definitions/users/definitions/email"},
            "password": {"$ref": "#/definitions/users/definitions/password"}
          },
          "required": ["email", "password"]
        },
        "targetSchema": {"$ref": "#/definitions/users"}
      }, {
        "authenticated": true,
        "description": "I sign to a Merchant",
        "href": "/useMerchant",
        "method": "POST",
        "rel": "merchant",
        "schema": {
          "type": "object",
          "properties": {"merchantUuid": {"type": "string", "format": "uuid"}},
          "required": ["merchantUuid"]
        }
      }, {
        "authenticated": true,
        "description": "I reset an user password",
        "href": "/users/{(%23%2Fdefinitions%2Fusers%2Fdefinitions%2Fid)}/reset-password",
        "method": "POST",
        "rel": "reset password",
        "schema": {
          "type": "object",
          "properties": {"id": {"$ref": "#/definitions/users/definitions/id"}},
          "required": ["id"]
        }
      }]
    }
  }
};
