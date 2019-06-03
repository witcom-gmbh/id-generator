# id-generator

ID-Generator-API for Services (Customer-facing and internal). Service-IDs consist of a sequence-number that is padded by 0's to have an equal width
and are prefixed by a service-type-specific prefix.

Sequences are service-type specific, that means sequence no. 12 can csafely coexist for end-user services, infrastrukture services, etc.

Infrastructure services are mainly used for telco-services where different layers of services exist, that are built upon each other.

## Requirements
Requires a REDIS-Instance for storing the highest sequence-number per Service-Type.
Connectio to REDIS is configured by environment-variables

```
REDIS_PASSWORD=some-password
REDIS_HOST=some-host-name
REDIS_PORT=6379
``` 

## Configuration
Definition of Sequence-Numbers/Service-Types/etc. is done statically in ./app/config/generatorconfig.js

###Sequences
Sequences define the number-part of the service-id. Sequences are incrementing. Every sequnce has the following configurable attributes

* key - unique-id of the sequence
* initialCursor - starting-value, default 1
* maxValue - maximum value, default 99999999
* padding - character that prefixes the sequence, so that all sequences have the same width, default 0

###Management-Domains
It is possible to differentiate infrastructure-services by the management-domain, that is the system where the infrastructure-service is configured.
The id of the management-domain can be used in a prefix to the sequence-number. Services in different management-domains share the same sequnce-number range
as long as the services use the same sequence-key.
To use different sequence-number ranges per management-domain, different service-types have to be configured

###Service-Owner
It is possible to differentiate infrastructure-services by the owner, that is the provider of the infrastructure-service.
The ID of the Service-Owner can be used in a prefix to the sequence-number. Services with different owners share the same sequnce-number range
as long as the services use the same sequence-key.
To use different sequence-number ranges per owner, different service-types have to be configured

###Service-Types
Service-Types define how a service-id is generated. Service-Types are configured as follows

* name -> Displayname
* id: -> internal-id, used in a request for Service-IDs
* sequenceKey -> defines which sequence is used for the service-ide
* type: -> distinguishes between infrastructure (Prefix IS-)  & customer-facing (prefix CF-) service-types 
* prefixTemplate -> Template that is used to generate the service-id. The folloing placeolders can be used
** ##OWNER## -> Owner
** ##MD## -> Management-Domain
** ##SEQ## -> padded Sequence-Number (if not present in template, no sequnce number is added at all)


## API-Endpoints (Details see swagger-specifications)
ID-Genertors

* /api/v1/cf-service -> Generator for customer-facing services
* /api/v1/is-service -> Generator for indrastructure services

Helpers

* /api/v1/is-service-type -> Get available infrastructure service types
* /api/v1/cf-service-type -> Get available customer-facing service types
* /api/v1/service-owner -> Get available service-owners
* /api/v1/management-domain -> Get available management-domaind


