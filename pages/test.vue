<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Test des Composants UI</h1>
    
    <div class="space-y-4">
      <UButton color="blue">Bouton Test</UButton>
      <UBadge label="Badge Test" color="green" />
      <UIcon name="i-heroicons-qr-code" class="h-8 w-8 text-blue-500" />
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'TestPage'
})
</script> 