<script setup lang="ts">
import Button from '~/components/ui/button/Button.vue'
</script>

<template>
  <div class="h-full w-full flex items-center justify-center p-8">
    <div class="max-w-5xl w-full">
      <div class="flex gap-8">
        <div class="w-1/2">
          <img src="/ZakoLogo.png" alt="Logo" class="h-auto w-full" loading="lazy">
        </div>

        <div class="h-100 w-1/2 flex flex-col justify-between">
          <div class="mt-30 text-4xl font-bold">
            杂鱼盒
          </div>

          <div>
            <Button class="rounded-md bg-white px-2 text-gray-800 shadow-md transition-colors duration-200 hover:bg-gray-200">
              <i class="i-carbon-logo-github mr-2" />
              Github登录
            </Button>
          </div>
        </div>
      </div>

      <div class="mt-8 space-y-4">
        <div class="border rounded-md p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xl">
                Zako Pako
              </p>
            </div>

            <div>
              <p class="text-xl">
                还没有钱呢！
              </p>
            </div>
          </div>
        </div>
        <div class="border rounded-md p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xl">
                Zako Pako
              </p>
            </div>

            <div>
              <p class="text-xl">
                还没有钱呢！
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
