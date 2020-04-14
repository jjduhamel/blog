--------------------------------------------------------------------------------
-- Configuration
--------------------------------------------------------------------------------
{-# LANGUAGE OverloadedStrings #-}
import           Data.List              (sortBy)
import           Data.Monoid            (mappend)
import qualified Data.ByteString.Lazy.Char8 as C
import           Hakyll
import           Text.Jasmine
import           System.FilePath.Posix  (takeBaseName,takeDirectory
                                         ,(</>),splitFileName)

hakyllConf :: Configuration
hakyllConf = defaultConfiguration {
    deployCommand = "aws --profile hbpcb s3 sync --delete _site s3://johnduhamel.io"
  , previewHost = "0.0.0.0"
}

main :: IO ()
main = hakyllWith hakyllConf $ do
    match "images/*" $ do
      route   idRoute
      compile copyFileCompiler

    match "fonts/*" $ do
      route   idRoute
      compile copyFileCompiler

    match "css/*.css" $ do
      route   idRoute
      compile compressCssCompiler

    match "css/app.scss" $ do
      route $ setExtension "css"
      compile compressScssCompiler

    match "js/*" $ do
      route   idRoute
      compile compressJsCompiler

    match "posts/*.md" $ do
        route $ setExtension "html"
        compile $ pandocCompiler
          >>= loadAndApplyTemplate "templates/post.html"    postCtx
          >>= loadAndApplyTemplate "templates/default.html" postCtx
          >>= relativizeUrls

    create ["archive.html"] $ do
        route idRoute
        compile $ do
            posts <- recentFirst =<< loadAll "posts/*"
            let archiveCtx =
                  listField "posts" postCtx (return posts) `mappend`
                  constField "title" "Blog"                `mappend`
                  defaultContext

            makeItem ""
              >>= loadAndApplyTemplate "templates/archive.html" archiveCtx
              >>= loadAndApplyTemplate "templates/default.html" archiveCtx
              >>= relativizeUrls

    match "about.md" $ do
      route $ setExtension "html"
      compile $ pandocCompiler
        >>= applyAsTemplate defaultContext
        >>= loadAndApplyTemplate "templates/default.html" defaultContext
        >>= relativizeUrls

    match "portfolio.html" $ do
      route idRoute
      compile $ do
        getResourceBody
          >>= applyAsTemplate defaultContext
          >>= loadAndApplyTemplate "templates/default.html" defaultContext
          >>= relativizeUrls

    match "design.html" $ do
      route idRoute
      compile $ do
        getResourceBody
          >>= applyAsTemplate defaultContext
          >>= loadAndApplyTemplate "templates/default.html" defaultContext
          >>= relativizeUrls

    match "index.html" $ do
      route idRoute
      compile $ do
        posts <- fmap (take 3) . recentFirst =<< loadAll "posts/*"
        let indexCtx =
              listField "posts" postCtx (return posts) `mappend`
              constField "title" "Home"                `mappend`
              defaultContext
        getResourceBody
          >>= applyAsTemplate indexCtx
          >>= loadAndApplyTemplate "templates/default.html" indexCtx
          >>= relativizeUrls

    match "templates/*" $ compile templateBodyCompiler

--------------------------------------------------------------------------------
--  Compilers
--------------------------------------------------------------------------------
compressJsCompiler :: Compiler (Item String)
compressJsCompiler = do
  let minifyJS = C.unpack . minify . C.pack . itemBody
  s <- getResourceString
  return $ itemSetBody (minifyJS s) s

compressScssCompiler :: Compiler (Item String)
compressScssCompiler = do
  fmap (fmap compressCss) $
    getResourceString
    >>= withItemBody (unixFilter "sass" [ "--stdin"
                                        , "--scss"
                                        , "--style", "compressed"
                                        , "--load-path", "./css"
                                        ])

--------------------------------------------------------------------------------
-- Contexts
--------------------------------------------------------------------------------
defaultCtx :: Context String
defaultCtx =
    defaultContext

mainCtx :: Context String
mainCtx =
    defaultCtx

postCtx :: Context String
postCtx =
    dateField "date" "%B %e, %Y" `mappend`
    defaultCtx
