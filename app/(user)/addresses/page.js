"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { MapPin, Plus, Edit2, Trash2, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import UserSidebar from "@/components/shared/UserSidebar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import Breadcrumb from "@/components/shared/Breadcrumb";

const PROVINCES = ["کرمان","تهران","اصفهان","مشهد","شیراز","تبریز","اهواز","کرج","قم","رشت","ارومیه","زاهدان","همدان","سنندج","بندرعباس","اردبیل","بیرجند","بوشهر","زنجان","گرگان","ساری","قزوین","شهرکرد","کرمانشاه","خرم‌آباد","ایلام","یاسوج","مازندران","گیلان","سمنان"];

function AddressForm({ onSubmit, loading, defaultValues, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="عنوان آدرس" placeholder="مثلاً: خانه، محل کار" {...register("title", { required: "الزامی" })} error={errors.title?.message} required />
        <Input label="نام گیرنده" placeholder="نام کامل گیرنده" {...register("recipientName", { required: "الزامی" })} error={errors.recipientName?.message} required />
        <Input label="شماره موبایل گیرنده" placeholder="09123456789" dir="ltr" {...register("phone", { required: "الزامی", pattern: { value: /^09[0-9]{9}$/, message: "شماره نامعتبر" } })} error={errors.phone?.message} required />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">استان *</label>
          <select className="input-custom h-11" {...register("province", { required: "الزامی" })}>
            <option value="">انتخاب استان</option>
            {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          {errors.province && <p className="text-xs text-red-500 mt-1">{errors.province.message}</p>}
        </div>
        <Input label="شهر" placeholder="نام شهر" {...register("city", { required: "الزامی" })} error={errors.city?.message} required />
        <Input label="خیابان" placeholder="نام خیابان" {...register("street", { required: "الزامی" })} error={errors.street?.message} required />
        <Input label="کوچه / بن‌بست" placeholder="اختیاری" {...register("alley")} />
        <Input label="پلاک" placeholder="شماره پلاک" {...register("buildingNumber")} />
        <Input label="واحد" placeholder="شماره واحد" {...register("unit")} />
        <Input label="کد پستی" placeholder="۱۰ رقمی" dir="ltr" {...register("postalCode", { required: "الزامی", pattern: { value: /^[0-9]{10}$/, message: "کد پستی باید ۱۰ رقم باشد" } })} error={errors.postalCode?.message} required />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="w-4 h-4 accent-coffee-600 rounded" {...register("isDefault")} />
        <span className="text-sm text-gray-700">تنظیم به عنوان آدرس پیش‌فرض</span>
      </label>
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>انصراف</Button>
        <Button type="submit" loading={loading}>ذخیره آدرس</Button>
      </div>
    </form>
  );
}

export default function AddressesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const qc = useQueryClient();

  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => axios.get("/api/addresses").then((r) => r.data.data),
    staleTime: 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (data) => axios.post("/api/addresses", data),
    onSuccess: () => { toast.success("آدرس اضافه شد"); qc.invalidateQueries(["addresses"]); setModalOpen(false); },
    onError: (e) => toast.error(e.response?.data?.message || "خطا"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => axios.put(`/api/addresses/${id}`, data),
    onSuccess: () => { toast.success("آدرس بروزرسانی شد"); qc.invalidateQueries(["addresses"]); setEditAddress(null); },
    onError: (e) => toast.error(e.response?.data?.message || "خطا"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`/api/addresses/${id}`),
    onSuccess: () => { toast.success("آدرس حذف شد"); qc.invalidateQueries(["addresses"]); },
    onError: () => toast.error("خطا در حذف"),
  });

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: "آدرس‌هایم" }]} />
      <div className="flex flex-col lg:flex-row gap-6 mt-2">
        <UserSidebar />
        <main className="flex-1">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">آدرس‌هایم</h2>
              <Button size="sm" onClick={() => setModalOpen(true)}>
                <Plus size={15} /> افزودن آدرس
              </Button>
            </div>

            {isLoading ? (
              <div className="p-5 space-y-3">
                {[1, 2].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
              </div>
            ) : !addresses?.length ? (
              <EmptyState
                icon={MapPin}
                title="آدرسی ثبت نشده"
                description="برای خرید، آدرس تحویل خود را اضافه کنید"
                action={{ label: "افزودن آدرس", onClick: () => setModalOpen(true) }}
              />
            ) : (
              <div className="p-5 grid sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div key={addr._id} className={`border rounded-2xl p-4 transition-all ${addr.isDefault ? "border-coffee-300 bg-coffee-50" : "border-gray-200 hover:border-coffee-200"}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800 text-sm">{addr.title}</span>
                        {addr.isDefault && (
                          <span className="flex items-center gap-1 text-xs text-coffee-600 font-medium">
                            <Star size={11} className="fill-coffee-400" /> پیش‌فرض
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setEditAddress(addr)} className="p-1.5 text-gray-400 hover:text-coffee-600 rounded-lg hover:bg-coffee-50 transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => deleteMutation.mutate(addr._id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{addr.recipientName}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {addr.province}، {addr.city}، {addr.street}
                      {addr.buildingNumber && `، پلاک ${addr.buildingNumber}`}
                      {addr.unit && `، واحد ${addr.unit}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1" dir="ltr">{addr.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="افزودن آدرس جدید" size="2xl">
        <AddressForm
          onSubmit={(data) => createMutation.mutate(data)}
          loading={createMutation.isPending}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {/* Edit modal */}
      <Modal isOpen={!!editAddress} onClose={() => setEditAddress(null)} title="ویرایش آدرس" size="2xl">
        {editAddress && (
          <AddressForm
            defaultValues={editAddress}
            onSubmit={(data) => updateMutation.mutate({ id: editAddress._id, data })}
            loading={updateMutation.isPending}
            onCancel={() => setEditAddress(null)}
          />
        )}
      </Modal>
    </div>
  );
}
