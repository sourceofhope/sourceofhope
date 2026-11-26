import {editorialTypes} from './editorial'
import {existingTypes} from './existing'
import {sharedTypes} from './shared'

/** The v2 schema (slice 2.5): used by the `v2` workspace on `staging` and `production-v2`. */
export const schemaTypesV2 = [...sharedTypes, ...editorialTypes, ...existingTypes]

export {SINGLETONS} from './editorial'
export {LANGUAGES} from './shared'
