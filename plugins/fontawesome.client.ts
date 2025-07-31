// plugins/fontawesome.client.ts
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Import des icônes solid
import {
  faSearch,
  faRefresh,
  faEye,
  faDownload,
  faEdit,
  faTimes,
  faPlus,
  faCheck,
  faStar,
  faBuilding,
  faTag,
  faDollarSign,
  faWeightHanging,
  faUser,
  faCalendar,
  faChevronLeft,
  faChevronRight,
  faEllipsisH,
  faQrcode,
  faImage,
  faFileImage,
  faSave,
  faTrash,
  faCog,
  faInfoCircle,
  faExclamationTriangle,
  faCheckCircle,
  faTimesCircle,
  faList,
  faCogs
} from '@fortawesome/free-solid-svg-icons'

// Import des icônes regular
import {
  faUser as farUser,
  faCalendar as farCalendar,
  faStar as farStar
} from '@fortawesome/free-regular-svg-icons'

// Ajouter les icônes à la bibliothèque
library.add(
  // Solid icons
  faSearch,
  faRefresh,
  faEye,
  faDownload,
  faEdit,
  faTimes,
  faPlus,
  faCheck,
  faStar,
  faBuilding,
  faTag,
  faDollarSign,
  faWeightHanging,
  faUser,
  faCalendar,
  faChevronLeft,
  faChevronRight,
  faEllipsisH,
  faQrcode,
  faImage,
  faFileImage,
  faSave,
  faTrash,
  faCog,
  faCogs,
  faInfoCircle,
  faExclamationTriangle,
  faCheckCircle,
  faTimesCircle,
  faList,
  
  // Regular icons
  farUser,
  farCalendar,
  farStar
)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
}) 