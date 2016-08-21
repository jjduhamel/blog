# Blog

This is my personal blog.  I use [Hakyll]() to build the site.  Yes, it's insanely heavy for building a static site.  However, it's my site, and I'm interested in Haskell, so I decided to use it.

**Build from scratch**

```bash
$ stack clean
$ stack build
```

**Build changes**

```bash
$ stack exec site rebuild
```

*Note:* If that doesn't work, you might try to build the site from a clean slate.

```bash
$ stack exec site clean
$ stack exec site build
```

**Start development server**

```bash
$ stack exec site watch
```

**Deploy changes**

```bash
$ stack exec site deploy
```