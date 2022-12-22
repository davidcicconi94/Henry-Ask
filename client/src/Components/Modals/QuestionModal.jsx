import { 
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormLabel,
  Input,
  FormControl,
  Text,
  Textarea,
  Select,
  Box,
  Flex
 } from "@chakra-ui/react"
import { useState } from "react"
import { useRef } from "react"
import axios from "axios"
import API_URL from "../../config/environment"
import { useAuth } from "../AuthComponents/AuthContext"
/* import TextEditor from "../Posts/TextEditor" */
import JoditEditor, { Jodit } from "jodit-react";
let modulos = ["Modulo 1", "Modulo 2", "Modulo 3", "Modulo 4", "Sin modulos"]


export default function QuestionModal({title}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = useState("xl")
  const { user } = useAuth()
  const editor = useRef(null);
  const [post, setPost] = useState({
    title: "",
    body: "",
    tags: [],
    module: ""
  })

  const config = {
    readonly: false,
    enableDragAndDropFileToEditor: true,
    placeholder: "Escriba aqui por favor...",
    height: "450px",
    width: "100%",
    removeButtons: ["brush", "file", "copyformat"],
    showXPathInStatusbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
    toolbarAdaptive: true,
    toolbarSticky: true,
    uploader: {
      insertImageAsBase64URI: true
    },
  };

  const initialRef = useRef(null)
  const finalRef = useRef(null)

  const handleChange = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    })
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    let token = user.accessToken
    await axios.post(API_URL + "/posts", post, { headers: { Authorization: "Bearer " + token } })
  }

  return (
    <>
      <Button marginTop={"5px"} backgroundColor={"#FFFF01"} key={size} m={4} onClick={onOpen}>{title}</Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        size={"full"}
      >
        <ModalOverlay />
        <ModalContent w={"80vw"}>
          <ModalHeader></ModalHeader>
          <ModalCloseButton _hover={{background: "tomato"}} />
          <ModalBody pb={6}>
            <form >
            <FormControl>
              <FormLabel fontSize={"24px"}>Titulo de pregunta</FormLabel>
              <Text mb={"5px"} >Se especifico e imagina que estas preguntandole a otra persona.</Text>
                <Input name="title" value={post.title} onChange={handleChange} ref={initialRef} placeholder='Escribe tu pregunta...' />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel fontSize={"24px"}>Cuerpo</FormLabel>
              <Text mb={"5px"} >El cuerpo de la pregunta contiene los detalles de tu problema y, a futuro, la resolucion de este.</Text>
                <JoditEditor
                  ref={editor}
                  config={config}

                  tabIndex={1} // tabIndex of textarea

                />

                {/* <Textarea name="body" value={post.body} onChange={handleChange} h={"400px"} placeholder="Describe tu problema..." /> */}
            </FormControl>
              <input type="file" name="" id="" onChange={(e) => console.log(e.target.value)} />

            <FormControl mt={4}>
              <FormLabel fontSize={"24px"}>Tags</FormLabel>
              <Text mb={"5px"} >Añade hasta 3 tags para describir sobre que tecnologias es tu problema</Text>
                <Text fontSize={"14px"}>*Pulsa espacio para agregar cada tag</Text>
                {/* <Input name="tags" value={post.tags} onChange={handleChange}  placeholder="JAVASCRIPT, REACT..." /> */}
                <TagsInput post={post} setPost={setPost} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel fontSize={"24px"}>Modulo</FormLabel>
                <Text mb={"5px"} >Agrega a que modulo corresponde esta pregunta</Text>
                <Select name="module" onChange={handleChange} >
                  <option disabled selected >Selecciona el modulo</option>
                  {
                    modulos.map((m, i) => {
                      return <option key={i} value={m}>{m}</option>
                    })
                  }
                </Select>
              </FormControl>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleSubmit} bg='#ffff01' _hover={{ background: "black", color: "white" }} boxShadow={"0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);"} mr={3}>
              Enviar
            </Button>
            <Button _hover={{background: "tomato"}} onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}



function TagsInput({ post, setPost }) {
  function handleKeyDown(e) {
    if (e.code !== 'Space' || e.keyCode !== 32) return

    const value = e.target.value
    if (!value.trim()) return

    let same = post.tags.some((t, i) => t === value.toUpperCase())
    if (same) return alert("no puedes agregar un mismo tag")
    if (post.tags.length > 2) return alert("no puedes agregar mas de 3 tags")

    setPost({
      ...post,
      tags: [...post.tags, value.toUpperCase().trim()]

    })
    e.target.value = ''
  }

  function removeTag(index) {

    let remove = post.tags.filter((el, i) => i !== index)
    setPost({
      ...post,
      tags: remove
    })
    /* setPost(post.tags.filter((el, i) => i !== index)) */
  }

  return (
    <Flex
      border={"1px solid black"}
      h={"50px"}
      alignItems="center"
    >
      {post.tags.map((tag, index) => (
        <Flex
          backgroundColor={"#ffff01"} h={"30px"}
          alignItems="center"
          borderRadius={"15px"} p={"10px"}
          key={index}
          marginLeft={"10px"}>
          <Text marginRight={"5px"} >{tag}</Text>
          <Box
            bgColor={"black"}
            color="white"
            borderRadius={"50%"}
            w="25px" h={"25px"}
            textAlign="center"
            cursor={"pointer"}
            onClick={() => removeTag(index)}>
            <Text>x</Text>
          </Box>
        </Flex>
      ))
      }
      <Input
        alignSelf={"center"}
        border="none"
        marginLeft={"15px"}
        borderRadius={"none"} w={"200px"} h={"30px"} type="text" onKeyUp={handleKeyDown} placeholder="REACT JAVASCRIPT..." />
    </Flex >
  )
}

