import { PencilSquareIcon } from "@heroicons/react/20/solid"
import { toast } from "react-toastify"
import { KeyedMutator } from "swr"
import { updateGallery } from "../lib/api/library"
import { Gallery, GalleryMeta } from "../types/api"
import PopupLarge from "./PopupLarge"

interface EditGalleryProps {
  gallery: GalleryMeta
  mutate: KeyedMutator<Gallery>
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

const EditGallery = ({ gallery, mutate }: EditGalleryProps) => {
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, uuid: string) => {
    e.preventDefault()
    const target = e.target as typeof e.target & Form
    const galleryForm = {
      title: target.title.value,
      titleNative: target.titleNative.value,
      TitleTranslated: target.titleTranslated.value,
      released: target.released.value,
      series: target.series.value,
      category: target.category.value,
      language: target.language.value,
      translated: target.translated.checked,
      nsfw: target.nsfw.checked,
      // exhToken: target.exhToken.value,
      // exhGid: target.exhGid.value,
      // anilistID: target.anilistID.value,
      // urls: target.urls.value,
    }
    const response = await updateGallery(uuid, galleryForm)
    if (response) {
      toast.success("Gallery updated")
      mutate()
    } else {
      toast.error("Failed to update gallery")
    }
  }

  return (
    <PopupLarge
      activator={
        <button type="button" className="text-white bg-blue-600 hover:bg-blue-800" title="Edit gallery info">
          <PencilSquareIcon className="h-5 w-5 text-zinc-100" />
        </button>
      }
    >
      <p className="mb-2 text-xl">
        Editing <span className="font-bold">{gallery.UUID}</span>
      </p>
      <form onSubmit={(e) => handleUpdate(e, gallery.UUID)}>
        <label>Title</label>
        <input type="text" id="title" defaultValue={gallery.Title} />
        <label>Native Title</label>
        <input type="text" id="titleNative" defaultValue={gallery.TitleNative} />
        <label>Translated Title</label>
        <input type="text" id="titleTranslated" defaultValue={gallery.TitleTranslated} />
        <label>Released (event or date)</label>
        <input type="text" id="released" defaultValue={gallery.Released} />
        <label>Series</label>
        <input type="text" id="series" defaultValue={gallery.Series} />
        <label>Category</label>
        <input type="text" id="category" defaultValue={gallery.Category} />
        <label>Language</label>
        <input type="text" id="language" defaultValue={gallery.Language} />
        <div className="grid grid-flow-col" style={{ gridAutoColumns: "100px" }}>
          <span>
            <label>Translated</label>
            <input type="checkbox" id="translated" className="checkbox mb-4" defaultChecked={gallery.Translated} />
          </span>
          <span>
            <label>NSFW</label>
            <input type="checkbox" id="nsfw" className="checkbox" defaultChecked={gallery.Nsfw} />
          </span>
        </div>
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
