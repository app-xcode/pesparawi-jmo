import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import L from "leaflet"
import Navbar from "./Navbar"

export default function MapView({ setRefresh, refresh }) {
    const [gereja, setGereja] = useState([])
    const [editData, setEditData] = useState(null)
    const [filterTeritori, setFilterTeritori] = useState(null)
    const [filterStatus, setFilterStatus] = useState(null)
    const filteredGereja = gereja.filter((g) => {
        const matchTeritori =
            filterTeritori ? g.teritori === filterTeritori : true

        const matchStatus =
            filterStatus !== null ? g.status_kunjungan === filterStatus : true

        return matchTeritori && matchStatus
    })

    useEffect(() => {
        fetchData()

        const channel = supabase
            .channel('gereja-realtime')
            .on(
                'postgres_changes',
                {
                    event: '*', 
                    schema: 'public',
                    table: 'gereja'
                },
                (payload) => {
                    console.log('Perubahan data:', payload)
                    fetchData()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    async function fetchData() {
        const { data, error } = await supabase
            .from("gereja")
            .select("*")

        if (error) {
            console.error(error)
        } else {
            setGereja(data)
        }
    }

    function getMarkerIcon(g) {
        let color = "blue"

        if (g.teritori === 1) color = "red"
        if (g.teritori === 2) color = "blue"
        if (g.teritori === 3) color = "green"

        const iconUrl = g.status_kunjungan
            ? `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`
            : `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`

        return L.icon({
            iconUrl,
            shadowUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            className: g.status_kunjungan ? 'hue-rotate-333 brightness-[1.2]' : 'brightness-[0.7]'
        })
    }


    return (
        <>
            {editData && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[2000]">

                    <div className="bg-white p-6 rounded-xl w-[400px] space-y-3">

                        <h2 className="font-bold text-lg">Edit Gereja</h2>

                        <input
                            className="w-full border p-2 rounded"
                            value={editData.nama_gereja}
                            onChange={(e) =>
                                setEditData({ ...editData, nama_gereja: e.target.value })
                            }
                            placeholder="Gereja"
                        />

                        <input
                            className="w-full border p-2 rounded"
                            value={editData.nama_pendeta || ""}
                            onChange={(e) =>
                                setEditData({ ...editData, nama_pendeta: e.target.value })
                            }
                            placeholder="Pendeta"
                        />

                        <input
                            className="w-full border p-2 rounded"
                            value={editData.no_hp || ""}
                            onChange={(e) =>
                                setEditData({ ...editData, no_hp: e.target.value.replace(/\s/g, '') })
                            }
                            placeholder="Telepon"
                        />

                        <input
                            className="w-full border p-2 rounded"
                            value={editData.alamat || ""}
                            onChange={(e) =>
                                setEditData({ ...editData, alamat: e.target.value })
                            }
                            placeholder="Alamat"
                        />

                        <select
                            className="w-full border p-2 rounded"
                            value={editData.teritori}
                            onChange={(e) =>
                                setEditData({ ...editData, teritori: parseInt(e.target.value) })
                            }
                        >
                            <option value="1">Teritori 1</option>
                            <option value="2">Teritori 2</option>
                            <option value="3">Teritori 3</option>
                        </select>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={editData.status_kunjungan}
                                onChange={(e) =>
                                    setEditData({ ...editData, status_kunjungan: e.target.checked })
                                }
                            />
                            Sudah Dikunjungi
                        </label>

                        <textarea
                            className="w-full border p-2 rounded"
                            placeholder="Catatan kunjungan"
                            value={editData.catatan_kunjungan || ""}
                            onChange={(e) =>
                                setEditData({ ...editData, catatan_kunjungan: e.target.value })
                            }
                        />

                        <div className="flex justify-end gap-2">

                            <button
                                onClick={() => setEditData(null)}
                                className="px-3 py-1 border rounded"
                            >
                                Batal
                            </button>

                            <button
                                onClick={async () => {
                                    const { error } = await supabase
                                        .from("gereja")
                                        .update({
                                            nama_gereja: editData.nama_gereja,
                                            nama_pendeta: editData.nama_pendeta,
                                            teritori: editData.teritori,
                                            no_hp: editData.no_hp,
                                            alamat: editData.alamat,
                                            status_kunjungan: editData.status_kunjungan,
                                            catatan_kunjungan: editData.catatan_kunjungan,
                                        })
                                        .eq("id", editData.id)

                                    if (!error) {
                                        setEditData(null)
                                    } else {
                                        console.error(error)
                                    }
                                }}
                                className="px-3 py-1 bg-green-500 text-white rounded"
                            >
                                Simpan
                            </button>

                        </div>

                    </div>
                </div>
            )}
            <MapContainer
                center={[-10.170557639338401, 123.65000260082076]} // Bali
                zoom={13}
                className="h-screen w-full"
            >
                <TileLayer
                    // url="http://{s}.google.com/|vt/lyrs=m&x={x}&y={y}&z={z}"
                    url="http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
                    // url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    subdomains={["mt0", "mt1", "mt2", "mt3"]}
                    maxZoom={20}
                />

                {filteredGereja.map((g) => (
                    <Marker
                        key={g.id}
                        position={[g.lokasi_map.lat ?? '', g.lokasi_map.lng ?? '']}
                        icon={getMarkerIcon(g)}
                    >
                        <Popup>
                            <div className="text-sm space-y-2">

                                <h2 className="font-bold">{g.nama_gereja}</h2>

                                <p>
                                    <b>Alamat :</b> {g.alamat}
                                </p>

                                <p>
                                    <b>Teritori :</b> {g.teritori}
                                </p>

                                <p>
                                    <b>Status :</b> {g.status_kunjungan ? "Sudah" : "Belum"}
                                </p>

                                <div className="flex gap-3 justify-center items-center">
                                    <button
                                        onClick={() => {
                                            const lat = g.lokasi_map.lat
                                            const lng = g.lokasi_map.lng

                                            const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

                                            window.open(url, "_blank")
                                        }}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 m-0"
                                    >
                                        Buka Rute
                                    </button>

                                    <button
                                        onClick={() => setEditData(g)}
                                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-700 text-white rounded m-0"
                                    >
                                        Edit
                                    </button>
                                </div>

                            </div>
                        </Popup>
                    </Marker>
                ))}
                <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow-lg text-sm z-[1000]">
                    <div><span className="text-red-500">●</span> Teritori 1</div>
                    <div><span className="text-blue-500">●</span> Teritori 2</div>
                    <div><span className="text-green-500">●</span> Teritori 3</div>
                    <hr className="my-1" />
                    <div><span className="text-green-500">●</span> Sudah dikunjungi</div>
                    <div><span className="text-green-800">●</span> Belum dikunjungi</div>
                </div>
            </MapContainer>
            <Navbar onAdded={() => setRefresh(!refresh)}
                filterTeritori={filterTeritori}
                setFilterTeritori={setFilterTeritori}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
            />
        </>
    )
}