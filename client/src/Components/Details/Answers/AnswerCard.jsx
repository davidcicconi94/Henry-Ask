import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import {
    Grid,
    GridItem,
    Flex,
    Image,
    Text,
    useDisclosure,
    Tooltip
} from "@chakra-ui/react";
import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useAuth } from "../../AuthComponents/AuthContext"
import API_URL from "../../../config/environment"
import Comments from '../Comments/Comments';
import DetailBody from '../../DetailBody/DetailBody';
import CreateComment from '../Comments/CreateComment';
import moment from "moment"
import { localeData } from 'moment_spanish_locale';
import 'moment/locale/es';

const AnswerCard = ({ answerCardData, setDataPost, finish }) => {

    const { user } = useAuth();
    let token = user.accessToken
    const idPost = useParams().id;

    moment.updateLocale('es', localeData)
    let dif = moment(answerCardData.createdAt).startOf('minutes').fromNow()

    const [numberOfVotesAnswerd, setNumberOfVotesAnswerd] = useState(parseInt(answerCardData.score))
    const [numberOfVotesUser, setNumberOfVotesUser] = useState(parseInt(answerCardData.user.score))
    const [currentVote, setCurrentVote] = useState(Object.keys(answerCardData.voters).includes(user.uid) ? parseInt(answerCardData.voters[user.uid]) : 0)
    const [commentAnswers, setCommentAnswers] = useState([])
    const [commentPage, setCommentPage] = useState(0)
    const [remainingComments, setRemainingComments] = useState(answerCardData.numberComments)
    const [showComments, setShowComments] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {

        setNumberOfVotesAnswerd(parseInt(answerCardData.score))
        setNumberOfVotesUser(parseInt(answerCardData.user.score))
        setCurrentVote(Object.keys(answerCardData.voters).includes(user.uid) ? parseInt(answerCardData.voters[user.uid]) : 0)

    }, [answerCardData])

    useEffect(() => {

        if (numberOfVotesUser !== parseInt(answerCardData.user.score)) {
            axios.get(API_URL + `/posts/${idPost}`, { headers: { Authorization: "Bearer " + token } })
                .then(res => { setDataPost(res.data) })
        }

    }, [numberOfVotesUser])

    useEffect(() => { (commentPage > 0) && getComment() }, [commentPage])

    const voteAnswer = async (type) => {

        const res = await
            axios.put(API_URL + `/answer/${type}`, { answer_id: answerCardData._id }, { headers: { Authorization: "Bearer " + token } })
        setNumberOfVotesAnswerd(res.data.voteAnswer)
        setNumberOfVotesUser(res.data.authorScore)
        setCurrentVote(type)
    }

    const getComment = async () => {

        const res = await axios.get(API_URL + `/comment/answer?answer_id=${answerCardData._id}&page=${commentPage}`, { headers: { Authorization: "Bearer " + token } })
        setCommentAnswers([...commentAnswers, ...res.data.comments])
        setRemainingComments(res.data.numberOfCommentsLeft)

    }

    return (
        <>
            <Grid position="relative"
                templateRows='repeat(2, 1fr)'
                templateColumns='repeat(8, 1fr)'
                p=".8rem"
                boxSize="100%"
                gap="1rem">
                <GridItem rowSpan={2} colSpan={1} align="center" >
                    <Image
                        objectFit="cover"
                        mt=".8rem"
                        w="5rem"
                        h="5rem"
                        borderRadius="5rem"
                        src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
                        alt="Caffe Latte"
                    />
                    <Image w="2.1rem" mt=".5rem"
                        src="https://i.postimg.cc/rw0MgSxN/medalla-6.png" alt="userImage" />
                </GridItem >
                <GridItem rowSpan={2} colSpan={6} direction="column">
                    <Flex alignItems="center"
                        gap=".4rem"
                        fontSize=".75rem"
                        fontWeight="bold">
                        <Text >
                            {`${answerCardData.user.userSlack} •`}
                        </Text>
                        <Text cursor="pointer">
                            <Tooltip label={new Date(answerCardData.createdAt).toLocaleString()}
                                placement='top'>
                                {`${dif} •`}
                            </Tooltip>
                        </Text>
                        <Image w="1.4rem" alignSelf="flex-start"
                            src="https://i.postimg.cc/TwrFYv4p/image-30.png" alt="userImage" />
                        <Text >
                            {numberOfVotesUser}
                        </Text>
                    </Flex>
                    <DetailBody body={answerCardData.body} />
                </GridItem>
                <GridItem rowSpan={2} colSpan={1} align="center"
                    fontSize="2rem">
                    <TriangleUpIcon
                        color={currentVote === 1 ? "green" : "gray"}
                        onClick={e => (user.uid !== answerCardData.user._id) ? (currentVote === 1 ? voteAnswer(0) : voteAnswer(1)) : null} />
                    <Text>{numberOfVotesAnswerd}</Text>
                    <TriangleDownIcon
                        color={currentVote === -1 ? "red" : "gray"}
                        onClick={e => (user.uid !== answerCardData.user._id) ? (currentVote === -1 ? voteAnswer(0) : voteAnswer(-1)) : null} />
                </GridItem>
            </Grid>
            <Flex position="relative"
                flexDir="column"
                alignItems="center"
                w="93%"
                gap=".3rem"
                borderBottom={finish ? "solid 1px" : ""}
                borderBottomColor="gray.800">
                <Flex w="100%" justifyContent="space-between">
                    <Flex fontSize=".8rem"
                        color="gray.600">
                        {(!showComments) ?
                            <Text cursor="pointer"
                                onClick={e => { commentPage === 0 && setCommentPage(1); setShowComments(true) }}>
                                Comentarios {` (${answerCardData.numberComments}) `} <TriangleDownIcon />
                            </Text>
                            :
                            <Text cursor="pointer"
                                onClick={e => { setShowComments(false) }}>
                                Comentarios {` (${answerCardData.numberComments}) `} <TriangleUpIcon />
                            </Text>}
                    </Flex>
                    <>
                        <Text color="blue.600"
                            cursor="pointer"
                            onClick={onOpen}>
                            Comentar respuesta
                        </Text>
                        <CreateComment isOpen={isOpen} onClose={onClose} type={"answer"} id={answerCardData._id} />
                    </>
                </Flex>
                {
                    (showComments) && commentAnswers.map((elem, i, arr) =>
                        <Flex key={i} w="100%">
                            <Comments dataComment={elem} />
                        </Flex>)
                }
                {
                    (showComments && remainingComments > 0 && commentAnswers.length > 0) &&
                    <Flex color="blue.500"
                        fontSize=".8rem"
                        w="100%"
                        pb=".5rem">
                        <Text cursor="pointer"
                            onClick={e => setCommentPage(commentPage + 1)}>
                            Ver más
                        </Text>
                    </Flex>
                }
            </Flex>
        </>
    )
}

export default AnswerCard;