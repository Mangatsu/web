import { PencilAltIcon } from "@heroicons/react/solid"
import { toast } from "react-toastify"
import { updateGallery } from "../lib/api/library"
import { GalleryMeta } from "../types/api"
import PopupLarge from "./PopupLarge"

interface EditGalleryProps {
  gallery: GalleryMeta
  token: string
}

const EditGallery = ({ gallery, token }: EditGalleryProps) => {
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, uuid: string) => {
    e.preventDefault()
    const target = e.target as typeof e.target & { title: { value: string } }
    const galleryForm = { title: target.title.value }
    const response = await updateGallery(token, uuid, galleryForm)
    if (response) {
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
        <input type="text" id="title" value={gallery.Title} />
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
