<template>
  <div class="users-page">
    <div class="page-header users-header">
      <div class="page-header__content">
        <h1 class="page-header__title">
          <FontAwesomeIcon icon="fa-users" class="title-icon" />
          Gestion des utilisateurs
        </h1>
        <p class="page-header__description">Administrez les rôles et les statuts des comptes</p>
      </div>
      <div class="toolbar">
        <div class="search">
          <FontAwesomeIcon icon="fa-search" />
          <input v-model="query" class="search__input" type="text" placeholder="Rechercher un utilisateur...">
        </div>
        <button class="btn" @click="refresh">
          <FontAwesomeIcon icon="fa-arrows-rotate" />
          Actualiser
        </button>
        <button class="btn" @click="openRoleModal">
          <FontAwesomeIcon icon="fa-cog" />
          Rôles
        </button>
      </div>
    </div>

    <div class="card card--elevated users-card">
      <div class="table-wrapper">
        <div v-if="loading" class="table-loading">
          <span class="loading-spinner" /> Chargement des utilisateurs...
        </div>
        <table v-else class="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in filteredUsers" :key="u.id">
              <td>{{ u.email }}</td>
              <td>{{ u.nom || '-' }}</td>
              <td>{{ u.prenom || '-' }}</td>
              <td>
                <select v-model="u.role" class="select" :disabled="isTargetAdmin(u) && !isCurrentAdmin" @change="handleChange(u)">
                  <option value="USER">USER</option>
                  <option value="MODERATEUR">MODERATEUR</option>
                  <option value="ADMIN" :disabled="!isCurrentAdmin">ADMIN</option>
                </select>
              </td>
              <td>
                <label class="switch">
                  <input v-model="u.isActive" type="checkbox" :disabled="isTargetAdmin(u) && !isCurrentAdmin" @change="handleChange(u)">
                  <span class="slider" />
                </label>
              </td>
              <td class="row-actions">
                <button class="btn btn--sm" :disabled="isSaving[u.id] || (isTargetAdmin(u) && !isCurrentAdmin)" @click="updateUser(u)">
                  <template v-if="isSaving[u.id]">
                    <span class="loading-spinner" />
                    Sauvegarde...
                  </template>
                  <template v-else>
                    <FontAwesomeIcon icon="fa-save" />
                    Enregistrer
                  </template>
                </button>
                <button v-if="isCurrentAdmin" class="btn btn--sm" :disabled="isTargetAdmin(u)" @click="deleteUser(u)">
                  <FontAwesomeIcon icon="fa-trash" />
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Modal de configuration des rôles (design modernisé) -->
    <div v-if="showRoleModal" class="modal-overlay" @click.self="closeRoleModal">
      <div class="modal rbac-modal">
        <div class="modal__header">
          <h3 class="modal__title">
            <FontAwesomeIcon icon="fa-shield" />
            Droits et permissions
          </h3>
          <button class="modal__close" @click="closeRoleModal">
            <FontAwesomeIcon icon="fa-times" />
          </button>
        </div>
        <div class="modal__body">
          <p class="rbac-subtitle">Activez/Désactivez les autorisations par rôle. Les changements s’appliquent à l’ensemble de l’application.</p>
          <div class="rbac-grid">
            <div class="rbac-head">Permission</div>
            <div v-for="role in roles" :key="role" class="rbac-head">
              <span class="role-chip" :data-role="role">{{ role }}</span>
            </div>

            <template v-for="perm in permDefs" :key="perm.key">
              <div class="rbac-perm">
                <div class="perm-title">{{ perm.label }}</div>
                <div v-if="perm.hint" class="perm-hint">{{ perm.hint }}</div>
              </div>
              <div v-for="role in roles" :key="role + '-' + perm.key" class="rbac-toggle" @click="onRBACClick(role)">
                <label class="switch">
                  <input v-model="matrixLocal[role][perm.key]" type="checkbox" :disabled="!isEditableRBACColumn(role)">
                  <span class="slider" />
                </label>
              </div>
            </template>
          </div>
        </div>
        <div class="modal__footer">
          <button class="btn" @click="closeRoleModal">
            <FontAwesomeIcon icon="fa-times" />
            Annuler
          </button>
          <button class="btn btn-primary" @click="saveRBAC">
            <FontAwesomeIcon icon="fa-save" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import type { RBACMatrix } from '~/composables/useRBAC'
import type { User } from '@prisma/client'
import { useRouter, useAuth } from '#imports'
import { useRBAC } from '~/composables/useRBAC'
import { useToast } from '~/composables/useToast'

const router = useRouter()
const { user: currentUser, isAuthenticated, initializeAuth } = useAuth()

const users = ref<User[]>([])
const query = ref('')
const isSaving = reactive<Record<string, boolean>>({}) // { [userId]: boolean }
const showRoleModal = ref(false)
const { matrix, persistPermissions, can, loadFromServer } = useRBAC()
// Écoute globale pour resynchroniser immédiatement l'UI après changement d'auth
const rbacVersion = ref(0)
const bumpRBAC = () => { rbacVersion.value++ }
onMounted(() => {
  if (import.meta.client) window.addEventListener('rbac-updated', bumpRBAC)
})
onBeforeUnmount(() => {
  if (import.meta.client) window.removeEventListener('rbac-updated', bumpRBAC)
})
const roles = ['ADMIN','MODERATEUR','USER'] as (keyof RBACMatrix)[]
const matrixLocal = reactive<RBACMatrix>(JSON.parse(JSON.stringify(matrix.value)))

// Synchroniser l'UI avec la source serveur quand elle change
const syncLocalWithState = () => {
  const next = JSON.parse(JSON.stringify(matrix.value)) as RBACMatrix
  for (const role of roles) {
    Object.assign(matrixLocal[role], next[role])
  }
}
watch(matrix, () => {
  syncLocalWithState()
}, { deep: true })
const loading = ref(false)
const originalById = reactive<Record<string, { role: string; isActive: boolean }>>({})

const currentRole = computed(() => { void rbacVersion.value; return currentUser.value?.role || 'USER' })
const isCurrentAdmin = computed(() => currentRole.value === 'ADMIN')
const isEditableRBACColumn = (roleCol: keyof RBACMatrix) => {
  if (roleCol === 'ADMIN') return false
  if (currentRole.value === 'ADMIN') return true
  if (currentRole.value === 'MODERATEUR') return roleCol === 'USER'
  return false
}
const onRBACClick = (roleCol: keyof RBACMatrix) => {
  if (!isEditableRBACColumn(roleCol)) {
    toastError('Ce rôle n\'est pas modifiable pour votre niveau')
  }
}
const isTargetAdmin = (u: User) => u.role === 'ADMIN'

const permDefs = [
  { key: 'dashboard.access', label: 'Accès Dashboard', hint: 'Permet d’entrer dans l’espace d’administration' },
  { key: 'qr.create', label: 'Créer QR', hint: '' },
  { key: 'barcode.create', label: 'Créer Code-barre', hint: '' },
  { key: 'items.edit', label: 'Modifier éléments', hint: '' },
  { key: 'items.delete', label: 'Supprimer éléments', hint: '' },
  { key: 'users.view', label: 'Voir utilisateurs', hint: '' },
  { key: 'users.edit', label: 'Éditer utilisateurs', hint: '' }
] as const

const filteredUsers = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return users.value
  return users.value.filter(u =>
    u.email.toLowerCase().includes(q) ||
    (u.nom || '').toLowerCase().includes(q) ||
    (u.prenom || '').toLowerCase().includes(q)
  )
})

const { success: toastSuccess, error: toastError } = useToast()

const fetchUsers = async () => {
  loading.value = true
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null
  try {
    const res = await $fetch<{ users: User[] }>('/api/users', {
      headers: token ? { authorization: `Bearer ${token}` } : {}
    })
    users.value = res.users
  } catch (e: unknown) {
    const err = e as { statusMessage?: string; message?: string }
    const msg = err?.statusMessage || err?.message || 'Accès non autorisé'
    toastError(msg)
    return
  }
  // snapshot originaux
  for (const u of users.value) {
    originalById[u.id] = { role: u.role as unknown as string, isActive: Boolean(u.isActive) }
  }
  loading.value = false
}

const handleChange = (u: User) => {
  // Garde: impossible de modifier un compte ADMIN si on n'est pas ADMIN
  if (isTargetAdmin(u) && !isCurrentAdmin.value) {
    // revert
    const orig = originalById[u.id]
    if (orig) {
      u.role = orig.role as unknown as User['role']
      u.isActive = Boolean(orig.isActive)
    }
    toastError('Les comptes ADMIN ne peuvent pas être modifiés')
    return
  }
  // Garde: on ne peut pas attribuer le rôle ADMIN sans être ADMIN
  if (u.role === 'ADMIN' && !isCurrentAdmin.value) {
    const orig = originalById[u.id]
    u.role = (orig?.role as unknown as User['role']) || u.role
    toastError('Vous ne pouvez pas attribuer le rôle ADMIN')
    return
  }
}

const updateUser = async (u: User) => {
  try {
    isSaving[u.id] = true
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null
    // Garde serveur: on ne peut pas modifier un compte ADMIN si on n'est pas ADMIN
    await $fetch(`/api/users/${u.id}`, {
      method: 'PUT',
      headers: token ? { authorization: `Bearer ${token}` } : {},
      body: { role: u.role, isActive: u.isActive }
    })
    toastSuccess('Utilisateur mis à jour')
    originalById[u.id] = { role: u.role as unknown as string, isActive: Boolean(u.isActive) }
  } catch (e: unknown) {
    const err = e as { statusMessage?: string; message?: string }
    const msg = err?.statusMessage || err?.message || 'Erreur lors de la mise à jour'
    toastError(msg)
  } finally {
    isSaving[u.id] = false
  }
}

onMounted(async () => {
  initializeAuth()
  await loadFromServer()
  syncLocalWithState()
  if (!isAuthenticated.value || !can('users.view')) {
    router.replace('/')
    return
  }
  await fetchUsers()
})

const openRoleModal = () => { showRoleModal.value = true }
const closeRoleModal = () => { showRoleModal.value = false }
const saveRBAC = async () => {
  // ADMIN: enregistre toutes les colonnes
  if (isCurrentAdmin.value) {
    const ok = await persistPermissions(matrixLocal)
    if (ok) {
      toastSuccess('Permissions enregistrées')
      closeRoleModal()
    } else {
      toastError('Échec de la persistance des permissions')
    }
    return
  }
  // MODERATEUR: ne peut enregistrer que USER
  if (currentRole.value === 'MODERATEUR') {
    const next: RBACMatrix = JSON.parse(JSON.stringify(matrix.value))
    next.USER = JSON.parse(JSON.stringify(matrixLocal.USER))
    const ok = await persistPermissions({ ADMIN: next.ADMIN, MODERATEUR: next.MODERATEUR, USER: next.USER })
    if (ok) {
      toastSuccess('Permissions USER enregistrées')
      closeRoleModal()
    } else {
      toastError('Échec de la persistance des permissions')
    }
    return
  }
  // USER: interdit
  toastError('Vous n\'avez pas les droits pour enregistrer les permissions')
}

// Suppression d’utilisateur (ADMIN uniquement)
const deleteUser = async (u: User) => {
  if (!isCurrentAdmin.value) {
    toastError('Seul un ADMIN peut supprimer un compte')
    return
  }
  if (u.role === 'ADMIN') {
    toastError('Impossible de supprimer un compte ADMIN')
    return
  }
  const sure = confirm(`Supprimer le compte ${u.email} ?`)
  if (!sure) return
  try {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null
    await $fetch(`/api/users/${u.id}`, { method: 'DELETE', headers: token ? { authorization: `Bearer ${token}` } : {} })
    users.value = users.value.filter(x => x.id !== u.id)
    toastSuccess('Compte supprimé')
  } catch (e: unknown) {
    const err = e as { statusMessage?: string; message?: string }
    const msg = err?.statusMessage || err?.message || 'Erreur lors de la suppression'
    toastError(msg)
  }
}
const refresh = async () => {
  await loadFromServer()
  await fetchUsers()
}
</script>

<style scoped>
.users-page { padding: var(--space-6) 0; display:flex; flex-direction:column; align-items:center; }
.users-header { width:100%; max-width:1200px; margin: 0 auto var(--space-6) auto; }
.page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom: var(--space-6); flex-wrap: wrap; gap: var(--space-3); }
.page-header__content { display:flex; flex-direction:column; gap: var(--space-1); }
.page-header__title { display:flex; align-items:center; gap: var(--space-2); margin:0; color: var(--color-primary); }
.page-header__description { margin:0; color: var(--color-muted); }
.title-icon { font-size: var(--font-size-xl); }
.toolbar { display:flex; align-items:center; gap: var(--space-3); }
.search { display:flex; align-items:center; gap: var(--space-2); padding: 8px 12px; border: 1px solid var(--color-border); background: var(--color-secondary); border-radius: var(--border-radius-lg); }
.search__input { border:none; outline:none; background:transparent; min-width: 240px; }

.card { background: var(--color-secondary); border: 1px solid var(--color-border); border-radius: var(--border-radius-lg); padding: var(--space-4); }
.users-card { width:100%; max-width: 1200px; margin: 0 auto; }
.card--elevated { box-shadow: var(--shadow-md); }
.table-wrapper { overflow:auto; }
.table { width:100%; border-collapse: collapse; }
.table th, .table td { padding: var(--space-3); border-bottom: 1px solid var(--color-border); text-align:left; vertical-align: middle; }
.table th { background: var(--color-light); color: var(--color-muted); font-weight: var(--font-weight-semibold); }
.select { padding: 6px 10px; border: 1px solid var(--color-border); background: var(--color-secondary); border-radius: 6px; }
.btn { display:inline-flex; align-items:center; gap: var(--space-2); padding: 6px 10px; border:1px solid var(--color-border); border-radius: 6px; background: var(--color-light); cursor:pointer; }
.btn--sm { font-size: 0.85rem; }
.loading-spinner { width: 14px; height: 14px; border: 2px solid transparent; border-top:2px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite; }
.table-loading { display:flex; align-items:center; gap: var(--space-2); padding: var(--space-6); color: var(--color-muted); }
@keyframes spin { to { transform: rotate(360deg); } }

.switch { position: relative; display: inline-block; width: 40px; height: 22px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .2s; border-radius: 22px; }
.slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 2px; bottom: 2px; background-color: white; transition: .2s; border-radius: 50%; }
input:checked + .slider { background-color: var(--color-primary); }
input:checked + .slider:before { transform: translateX(18px); }

@media (max-width: 640px) {
  .search__input { min-width: 0; width: 100%; }
  .users-card { padding: var(--space-2); }
  .table th, .table td { padding: var(--space-2); }
}

/* Modal RBAC */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); display:flex; align-items:center; justify-content:center; z-index:1000; }
.modal { width:100%; max-width: 900px; background: var(--color-secondary); border:1px solid var(--color-border); border-radius: var(--border-radius-lg); box-shadow: var(--shadow-lg); overflow: hidden; }
.modal__header, .modal__footer { display:flex; align-items:center; justify-content:space-between; padding: var(--space-4); background: var(--color-light); }
.modal__body { padding: var(--space-6); }
.modal__title { margin:0; display:flex; align-items:center; gap: var(--space-2); }
.modal__close { background: none; border: none; font-size: 20px; cursor: pointer; }
.rbac-modal { max-width: 960px; }
.rbac-subtitle { margin: 0 0 var(--space-4) 0; color: var(--color-muted); }
.rbac-grid { display: grid; grid-template-columns: 2fr repeat(3, 1fr); border:1px solid var(--color-border); border-radius: var(--border-radius); overflow:hidden; }
.rbac-head { background: var(--color-light); padding: var(--space-3); font-weight: var(--font-weight-semibold); text-align:center; border-right:1px solid var(--color-border); }
.rbac-head:first-child { text-align:left; }
.role-chip { display:inline-flex; align-items:center; gap:8px; padding:4px 10px; border-radius:999px; font-size:12px; background: var(--color-secondary); border:1px solid var(--color-border); }
.role-chip[data-role="ADMIN"] { color:#8b5cf6; border-color:#8b5cf6; }
.role-chip[data-role="MODERATEUR"] { color:#10b981; border-color:#10b981; }
.role-chip[data-role="USER"] { color:#3b82f6; border-color:#3b82f6; }
.rbac-perm { padding: var(--space-3); border-top:1px solid var(--color-border); }
.perm-title { font-weight: var(--font-weight-medium); }
.perm-hint { font-size: 12px; color: var(--color-muted); }
.rbac-toggle { display:flex; align-items:center; justify-content:center; border-top:1px solid var(--color-border); border-left:1px solid var(--color-border); padding: var(--space-2); }
</style>


