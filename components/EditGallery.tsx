import { PencilAltIcon } from "@heroicons/react/solid"
import { toast } from "react-toastify"
import { KeyedMutator } from "swr"
import { updateGallery } from "../lib/api/library"
import { GalleryMeta } from "../types/api"
import PopupLarge from "./PopupLarge"

interface EditGalleryProps {
  gallery: GalleryMeta
  mutate: KeyedMutator<unknown>
  token: string
}

interface Form {
  title: { value: string }
  titleNative: { value: string }
  titleTranslated: { value: string }
  released: { value: string }
  series: { value: string }
  category: { value: string }
  language: { value: string }
  translated: { checked: boolean }
  nsfw: { checked: boolean }
  hidden: { checked: boolean }
  exhToken: { value: string }
  exhGid: { value: number }
  anilistID: { value: number }
  urls: { value: string }
  tags: { value: string[] } // Record<string, string>
}

const EditGallery = ({ gallery, mutate, token }: EditGalleryProps) => {
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, uuid: string) => {
    e.preventDefault()
    const target = e.target as typeof e.target & Form
    const galleryForm = { title: target.title.value, nsfw: target.nsfw.checked }
    const response = await updateGallery(token, uuid, galleryForm)
    if (response) {
      mutate()
      toast.success("Gallery updated")
    } else {
      toast.error("Failed to update gallery")
    }
  }

  return (
    <PopupLarge
      activator={
        <button type="button" className="text-white bg-blue-600 hover:bg-blue-800">
          <PencilAltIcon className="h-5 w-5 text-zinc-100" />
        </button>
      }
    >
      <p>
        Editing <span className="font-bold">{gallery.UUID}</span>
      </p>
      <form className="max-w-xs" onSubmit={(e) => handleUpdate(e, gallery.UUID)}>
        <label>Title</label>
        <input type="text" id="title" defaultValue={gallery.Title} />
        <label>NSFW</label>
        <input type="checkbox" id="nsfw" defaultChecked={gallery.Nsfw} />
        <button
          type="submit"
          className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
        >
          Update
        </button>
      </form>
    </PopupLarge>
  )
}

export default EditGallery
