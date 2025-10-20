<script setup lang="ts">
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
    <Input type="vault-name" placeholder="金库要叫什么呢" />
    <Select>
      <SelectTrigger class="w-[180px]">
        <SelectValue placeholder="给谁建的呢" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>项目</SelectLabel>
          <SelectItem value="apple">
            杂鱼盒
          </SelectItem>
          <SelectItem value="banana">
            ZakoBox
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <Select>
      <SelectTrigger class="w-[180px]">
        <SelectValue placeholder="要用什么币呢" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>币种</SelectLabel>
          <SelectItem value="apple">
            杂鱼币
          </SelectItem>
          <SelectItem value="banana">
            zakozako~
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <Input type="vault-end-height" placeholder="到什么高度结束呢" />
    <Button type="submit">
      开建！
    </Button>
  </div>
</template>
