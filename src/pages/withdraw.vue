<script lang="ts" setup>
import Button from '~/components/ui/button/Button.vue'
import Input from '~/components/ui/input/Input.vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
</script>

<template>
  <div mt-40 space-y-5 class="flex flex-col items-center">
    <Input type="vault-name" placeholder="要取多少小鱼干呢" />
    <Select>
      <SelectTrigger class="w-[180px]">
        <SelectValue placeholder="取到那个包里呢" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>项目</SelectLabel>
          <SelectItem value="apple">
            杂鱼包
          </SelectItem>
          <SelectItem value="banana">
            ZakoWallet
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <Select />
    <Button class="mb-20 rounded-md bg-black px-2 text-white shadow-md transition-colors duration-200 hover:bg-gray-800">
      拿来！
    </Button>
  </div>
</template>
