import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import logo from '../assets/logo.webp'

export default function Navbar({ onAdded, filterTeritori, setFilterTeritori, filterStatus, setFilterStatus }) {
    const [open, setOpen] = useState(false)
    const [openDropdown, setOpenDropdown] = useState(false)

    const [form, setForm] = useState({
        nama_gereja: "",
        teritori: 1,
        nama_pendeta: "",
        no_hp: "",
        alamat: "",
        lat: "",
        lng: "",
    })

    useEffect(() => {
        const handleClickOutside = () => setOpenDropdown(false)
        window.addEventListener("click", handleClickOutside)
        return () => window.removeEventListener("click", handleClickOutside)
    }, [])

    const saveAdd = async () => {
        const { error } = await supabase.from("gereja").insert([
            {
                nama_gereja: form.nama_gereja,
                nama_pendeta: form.nama_pendeta,
                no_hp: form.no_hp,
                alamat: form.alamat,
                teritori: form.teritori,
                lokasi_map: {
                    lat: parseFloat(form.lat),
                    lng: parseFloat(form.lng),
                },
                status_kunjungan: false,
                catatan_kunjungan: "",
            },
        ])

        if (!error) {
            setOpen(false)
            if (onAdded) onAdded()
        } else {
            console.error(error)
        }
    }

    return (
        <div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-[95%] max-w-4xl">
                <div className="backdrop-blur-md bg-white/80 shadow-lg rounded-xl px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                    {/* TITLE */}
                    <div className="flex justify-center items-center gap-2">
                        <img src={logo} alt="Logo" className="w-7" />
                        <h1 className="font-semibold text-gray-800 text-center md:text-left">
                            Pesparawi
                        </h1>
                    </div>

                    {/* BUTTON GROUP */}
                    <div className="flex flex-wrap justify-center md:justify-end gap-2 text-sm">

                        {/* <button
                            onClick={() => setOpen(true)}
                            className="px-3 py-1 rounded text-black hover:bg-green-100"
                        >
                            Tambah
                        </button> */}
                        <div className="relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setOpenDropdown(!openDropdown) }}
                                className="px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-sm"
                            >
                                Filter ▾
                            </button>

                            {openDropdown && (
                                <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-lg overflow-hidden z-[2000] text-sm">

                                    {/* HEADER */}
                                    <div className="px-3 py-2 text-gray-500 border-b">
                                        Filter Data
                                    </div>

                                    {/* TERITORI */}
                                    <div className="px-3 py-2 font-semibold text-xs text-gray-500">
                                        Teritori
                                    </div>

                                    <button
                                        onClick={() => setFilterTeritori(null)}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${filterTeritori === null ? "bg-gray-200 font-semibold" : ""
                                            }`}
                                    >
                                        Semua
                                    </button>

                                    <button
                                        onClick={() => setFilterTeritori(1)}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${filterTeritori === 1 ? "bg-red-100 text-red-600 font-semibold" : ""
                                            }`}
                                    >
                                        Teritori 1
                                    </button>

                                    <button
                                        onClick={() => setFilterTeritori(2)}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${filterTeritori === 2 ? "bg-blue-100 text-blue-600 font-semibold" : ""
                                            }`}
                                    >
                                        Teritori 2
                                    </button>

                                    <button
                                        onClick={() => setFilterTeritori(3)}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${filterTeritori === 3 ? "bg-green-100 text-green-600 font-semibold" : ""
                                            }`}
                                    >
                                        Teritori 3
                                    </button>

                                    {/* STATUS */}
                                    <div className="px-3 py-2 font-semibold text-xs text-gray-500 border-t mt-2">
                                        Status
                                    </div>

                                    <button
                                        onClick={() => setFilterStatus(null)}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${filterStatus === null ? "bg-gray-200 font-semibold" : ""
                                            }`}
                                    >
                                        Semua Status
                                    </button>

                                    <button
                                        onClick={() => setFilterStatus(true)}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${filterStatus === true ? "bg-green-100 text-green-600 font-semibold" : ""
                                            }`}
                                    >
                                        Sudah Dikunjungi
                                    </button>

                                    <button
                                        onClick={() => setFilterStatus(false)}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${filterStatus === false ? "bg-red-100 text-red-600 font-semibold" : ""
                                            }`}
                                    >
                                        Belum Dikunjungi
                                    </button>

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[2000]">
                    <div className="bg-white p-6 rounded-xl w-[400px] space-y-3">

                        <h2 className="font-bold text-lg">Tambah Gereja</h2>

                        <input
                            placeholder="Nama Gereja"
                            className="w-full border p-2 rounded"
                            onChange={(e) =>
                                setForm({ ...form, nama_gereja: e.target.value })
                            }
                        />

                        <input
                            placeholder="Nama Pendeta"
                            className="w-full border p-2 rounded"
                            onChange={(e) =>
                                setForm({ ...form, nama_pendeta: e.target.value })
                            }
                        />

                        <input
                            placeholder="No HP"
                            className="w-full border p-2 rounded"
                            onChange={(e) =>
                                setForm({ ...form, no_hp: e.target.value })
                            }
                        />

                        <input
                            placeholder="Alamat"
                            className="w-full border p-2 rounded"
                            onChange={(e) =>
                                setForm({ ...form, alamat: e.target.value })
                            }
                        />

                        <div className="flex gap-2">

                            <input
                                placeholder="Lat"
                                className="w-full border p-2 rounded"
                                onChange={(e) => {
                                    const value = e.target.value
                                    const match = value.match(
                                        /(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/
                                    )
                                    if (match) {
                                        setForm({
                                            ...form,
                                            lat: match[1],
                                            lng: match[2],
                                        })
                                    } else {
                                        setForm({ ...form, lat: e.target.value })
                                    }
                                }}
                                value={form.lat}
                            />
                            <input
                                placeholder="Lng"
                                className="w-full border p-2 rounded"
                                onChange={(e) => {
                                    const value = e.target.value
                                    const match = value.match(
                                        /(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/
                                    )
                                    if (match) {
                                        setForm({
                                            ...form,
                                            lat: match[1],
                                            lng: match[2],
                                        })
                                    } else {
                                        setForm({ ...form, lng: e.target.value })
                                    }
                                }}
                                value={form.lng}
                            />
                        </div>

                        <select
                            className="w-full border p-2 rounded"
                            onChange={(e) =>
                                setForm({ ...form, teritori: parseInt(e.target.value) })
                            }
                        >
                            <option value="1">Teritori 1</option>
                            <option value="2">Teritori 2</option>
                            <option value="3">Teritori 3</option>
                        </select>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-3 py-1 border rounded"
                            >
                                Batal
                            </button>

                            <button
                                onClick={saveAdd}
                                className="px-3 py-1 bg-green-500 text-white rounded"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}