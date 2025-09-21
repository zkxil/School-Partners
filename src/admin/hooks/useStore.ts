import { useContext } from 'react'
import storeContext from '@/admin/contexts'

const useStore = () => useContext(storeContext)
export default useStore